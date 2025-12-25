package middleware

import (
	"net/http"
	"sync"
	"time"

	"monorepo/backend-go/internal/infrastructure/adapter/http/response"
)

// RateLimiter implements a simple in-memory rate limiter
type RateLimiter struct {
	visitors map[string]*visitor
	mu       sync.RWMutex
	rate     int           // requests per window
	window   time.Duration // time window
}

type visitor struct {
	limiter  *rateLimitBucket
	lastSeen time.Time
}

type rateLimitBucket struct {
	tokens     int
	lastRefill time.Time
}

// NewRateLimiter creates a new rate limiter
// rate: number of requests allowed per window
// window: time window duration
func NewRateLimiter(rate int, window time.Duration) *RateLimiter {
	rl := &RateLimiter{
		visitors: make(map[string]*visitor),
		rate:     rate,
		window:   window,
	}

	// Cleanup old visitors every minute
	go rl.cleanupVisitors()

	return rl
}

// Limit middleware limits requests per IP address
func (rl *RateLimiter) Limit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := getClientIP(r)

		if !rl.allow(ip) {
			response.JSONError(
				w,
				http.StatusTooManyRequests,
				"RATE_LIMIT_EXCEEDED",
				"Too many requests. Please try again later.",
			)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// allow checks if a request from the given IP is allowed
func (rl *RateLimiter) allow(ip string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	v, exists := rl.visitors[ip]
	if !exists {
		rl.visitors[ip] = &visitor{
			limiter: &rateLimitBucket{
				tokens:     rl.rate,
				lastRefill: time.Now(),
			},
			lastSeen: time.Now(),
		}
		v = rl.visitors[ip]
	}

	v.lastSeen = time.Now()

	// Refill tokens based on time passed
	now := time.Now()
	elapsed := now.Sub(v.limiter.lastRefill)

	if elapsed >= rl.window {
		v.limiter.tokens = rl.rate
		v.limiter.lastRefill = now
	}

	// Check if tokens are available
	if v.limiter.tokens > 0 {
		v.limiter.tokens--
		return true
	}

	return false
}

// cleanupVisitors removes old visitors from memory
func (rl *RateLimiter) cleanupVisitors() {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		rl.mu.Lock()
		for ip, v := range rl.visitors {
			if time.Since(v.lastSeen) > 3*time.Minute {
				delete(rl.visitors, ip)
			}
		}
		rl.mu.Unlock()
	}
}

func getClientIP(r *http.Request) string {
	// Check X-Forwarded-For header first
	xff := r.Header.Get("X-Forwarded-For")
	if xff != "" {
		return xff
	}

	// Check X-Real-IP header
	xri := r.Header.Get("X-Real-IP")
	if xri != "" {
		return xri
	}

	// Fall back to RemoteAddr
	return r.RemoteAddr
}

// LoginRateLimiter is a stricter rate limiter for login endpoints
func NewLoginRateLimiter() *RateLimiter {
	// 5 login attempts per 15 minutes
	return NewRateLimiter(5, 15*time.Minute)
}

// APIRateLimiter is a general rate limiter for API endpoints
func NewAPIRateLimiter() *RateLimiter {
	// 100 requests per minute
	return NewRateLimiter(100, 1*time.Minute)
}
