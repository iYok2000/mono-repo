package valueobject

// ServiceStatus is a value object representing the status of a service
// Value objects are immutable and defined by their attributes
type ServiceStatus string

const (
	ServiceStatusRecommended ServiceStatus = "recommended"
	ServiceStatusNew         ServiceStatus = "new"
	ServiceStatusComingSoon  ServiceStatus = "coming_soon"
	ServiceStatusDefault     ServiceStatus = "default"
)

// IsValid checks if the service status is valid
func (s ServiceStatus) IsValid() bool {
	switch s {
	case ServiceStatusRecommended, ServiceStatusNew, ServiceStatusComingSoon, ServiceStatusDefault:
		return true
	}
	return false
}

// String returns the string representation of the status
func (s ServiceStatus) String() string {
	return string(s)
}

// AllStatuses returns all valid service statuses
func AllStatuses() []ServiceStatus {
	return []ServiceStatus{
		ServiceStatusRecommended,
		ServiceStatusNew,
		ServiceStatusComingSoon,
		ServiceStatusDefault,
	}
}
