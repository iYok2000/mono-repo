"use client";

import { useParams } from "next/navigation";
import { Mail, Phone, Globe, MapPin, MessageCircle, Instagram, Facebook, Linkedin } from "lucide-react";
import { useEffect, useState } from "react";

interface BusinessCardData {
  name: string;
  nameEn?: string;
  position: string;
  positionEn?: string;
  company: string;
  logo?: string;
  themeColor: string;
  email: string;
  phone: string;
  website: string;
  lineId: string;
  instagram: string;
  facebook: string;
  linkedin: string;
}

export default function CardViewPage() {
  const params = useParams();
  const [data, setData] = useState<BusinessCardData>({
    name: 'ชื่อ-นามสกุล',
    position: 'ตำแหน่ง',
    company: '',
    themeColor: '#10B981',
    email: '',
    phone: '',
    website: '',
    lineId: '',
    instagram: '',
    facebook: '',
    linkedin: '',
  });

  useEffect(() => {
    // Hide header on mount
    document.body.dataset.hideHeader = 'true';
    
    // Decode base64 data from URL
    if (params.data) {
      try {
        let base64String = Array.isArray(params.data) ? params.data[0] : params.data;
        
        // Convert URL-safe base64 back to standard base64
        base64String = base64String.replace(/-/g, '+').replace(/_/g, '/').replace(/~/g, '=');
        
        // Decode base64 (UTF-8 safe)
        const binaryString = atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const jsonString = new TextDecoder().decode(bytes);
        const shortData = JSON.parse(jsonString);
        
        // Map short keys back to full names
        setData({
          name: shortData.n || 'ชื่อ-นามสกุล',
          position: shortData.p || 'ตำแหน่ง',
          company: shortData.c || '',
          logo: shortData.lg || '',
          themeColor: shortData.t || '#10B981',
          email: shortData.e || '',
          phone: shortData.ph || '',
          website: shortData.w || '',
          lineId: shortData.l || '',
          instagram: shortData.i || '',
          facebook: shortData.f || '',
          linkedin: shortData.ln || '',
        });
      } catch (e) {
        console.error('Failed to decode card data:', e);
      }
    }
    
    return () => {
      delete document.body.dataset.hideHeader;
    };
  }, [params]);

  return (
    <div 
      className="min-h-screen w-full bg-white"
      style={{
        background: `linear-gradient(to bottom, ${data.themeColor}15 0%, white 100%)`
      }}
    >
      {/* Header Strip with theme color */}
      <div 
        className="h-3"
        style={{ 
          background: `linear-gradient(to right, ${data.themeColor}, ${data.themeColor}dd)` 
        }}
      ></div>

      {/* Content - Full Screen */}
      <div className="px-8 py-10 space-y-8 max-w-lg mx-auto">
        {/* Company Logo - Top Right */}
        {data.logo && (
          <div className="flex justify-end">
            <div className="w-20 h-20 flex items-center justify-center">
              <img 
                src={data.logo} 
                alt="Company Logo" 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Profile Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[#1A1A1A]">{data.name}</h1>
          <p 
            className="text-xl font-semibold"
            style={{ color: data.themeColor }}
          >
            {data.position}
          </p>
          {data.company && (
            <p className="text-base text-[#666666] mt-2">{data.company}</p>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-5 text-base">
          {data.email && (
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 flex-shrink-0" style={{ color: data.themeColor }} />
              <span className="text-[#666666]">{data.email}</span>
            </div>
          )}

          {data.phone && (
            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 flex-shrink-0" style={{ color: data.themeColor }} />
              <span className="text-[#666666]">{data.phone}</span>
            </div>
          )}

          {data.website && (
            <div className="flex items-center gap-4">
              <Globe className="w-6 h-6 flex-shrink-0" style={{ color: data.themeColor }} />
              <span className="font-medium" style={{ color: data.themeColor }}>{data.website}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        {(data.lineId || data.instagram || data.facebook || data.linkedin) && (
          <div className="h-px bg-[#E8E8E6] my-8"></div>
        )}

        {/* Social Links */}
        {(data.lineId || data.instagram || data.facebook || data.linkedin) && (
          <div className="space-y-4">
            {data.lineId && (
              <div className="flex items-center gap-4 p-4 bg-[#FAFAF8] rounded-xl border border-[#E8E8E6]">
                <MessageCircle className="w-6 h-6 text-[#00B900]" />
                <span className="text-base text-[#666666]">LINE ID: {data.lineId}</span>
              </div>
            )}

            {data.instagram && (
              <div className="flex items-center gap-4 p-4 bg-[#FAFAF8] rounded-xl border border-[#E8E8E6]">
                <Instagram className="w-6 h-6 text-[#E4405F]" />
                <span className="text-base text-[#666666]">{data.instagram}</span>
              </div>
            )}

            {data.facebook && (
              <div className="flex items-center gap-4 p-4 bg-[#FAFAF8] rounded-xl border border-[#E8E8E6]">
                <Facebook className="w-6 h-6 text-[#1877F2]" />
                <span className="text-base text-[#666666]">{data.facebook}</span>
              </div>
            )}

            {data.linkedin && (
              <div className="flex items-center gap-4 p-4 bg-[#FAFAF8] rounded-xl border border-[#E8E8E6]">
                <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                <span className="text-base text-[#666666]">{data.linkedin}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
