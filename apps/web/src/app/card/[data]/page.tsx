"use client";

import { useParams } from "next/navigation";
import { Mail, Phone, Globe, MapPin, Instagram, Facebook, Linkedin } from "lucide-react";
import { useEffect, useState } from "react";

// LINE Official Icon Component
const LineIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
  </svg>
);

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
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Helper function to validate email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Helper function to copy text
  const copyToClipboard = async (text: string, itemName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemName);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Helper function to handle email click
  const handleEmailClick = (email: string) => {
    if (isValidEmail(email)) {
      window.location.href = `mailto:${email}`;
    }
  };

  // Helper function to handle phone click
  const handlePhoneClick = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  // Helper function to save contact to device
  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
TITLE:${data.position}
ORG:${data.company}
EMAIL:${data.email}
TEL:${data.phone}
URL:${data.website}
END:VCARD`;
    
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.name}.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

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
            <div className="group relative flex items-center gap-4">
              <Mail className="w-6 h-6 flex-shrink-0" style={{ color: data.themeColor }} />
              <a 
                href={`mailto:${data.email}`}
                className="flex-1 text-[#666666] hover:underline cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handleEmailClick(data.email);
                }}
              >
                {data.email}
              </a>
              <button
                onClick={() => copyToClipboard(data.email, 'email')}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-3 py-1.5 rounded-lg bg-[#FAFAF8] hover:bg-[#F0F0F0] border border-[#E8E8E6]"
                style={{ color: data.themeColor }}
              >
                {copiedItem === 'email' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          )}

          {data.phone && (
            <div className="group relative flex items-center gap-4">
              <Phone className="w-6 h-6 flex-shrink-0" style={{ color: data.themeColor }} />
              <a 
                href={`tel:${data.phone}`}
                className="flex-1 text-[#666666] hover:underline cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handlePhoneClick(data.phone);
                }}
              >
                {data.phone}
              </a>
              <button
                onClick={handleSaveContact}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-3 py-1.5 rounded-lg bg-[#FAFAF8] hover:bg-[#F0F0F0] border border-[#E8E8E6]"
                style={{ color: data.themeColor }}
              >
                Save
              </button>
            </div>
          )}

          {data.website && (
            <div className="flex items-center gap-4">
              <Globe className="w-6 h-6 flex-shrink-0" style={{ color: data.themeColor }} />
              <a 
                href={`https://${data.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline cursor-pointer"
                style={{ color: data.themeColor }}
              >
                {data.website}
              </a>
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
              <a
                href={`https://line.me/ti/p/~${data.lineId.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer"
                style={{ 
                  backgroundColor: '#00B90010',
                  borderColor: '#00B90030',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#00B90020';
                  e.currentTarget.style.borderColor = '#00B900';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#00B90010';
                  e.currentTarget.style.borderColor = '#00B90030';
                }}
              >
                <LineIcon className="w-6 h-6 text-[#00B900]" />
                <span className="text-base text-[#00B900] font-medium">LINE: {data.lineId}</span>
              </a>
            )}

            {data.instagram && (
              <a
                href={`https://instagram.com/${data.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer"
                style={{ 
                  background: 'linear-gradient(135deg, #f9ce3410, #ee2a7b10, #6228d710)',
                  borderColor: '#E4405F30',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f9ce3420, #ee2a7b20, #6228d720)';
                  e.currentTarget.style.borderColor = '#E4405F';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f9ce3410, #ee2a7b10, #6228d710)';
                  e.currentTarget.style.borderColor = '#E4405F30';
                }}
              >
                <Instagram className="w-6 h-6 text-[#E4405F]" />
                <span className="text-base text-[#E4405F] font-medium">{data.instagram}</span>
              </a>
            )}

            {data.facebook && (
              <a
                href={`https://facebook.com/${data.facebook.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer"
                style={{ 
                  backgroundColor: '#1877F210',
                  borderColor: '#1877F230',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1877F220';
                  e.currentTarget.style.borderColor = '#1877F2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1877F210';
                  e.currentTarget.style.borderColor = '#1877F230';
                }}
              >
                <Facebook className="w-6 h-6 text-[#1877F2]" />
                <span className="text-base text-[#1877F2] font-medium">{data.facebook}</span>
              </a>
            )}

            {data.linkedin && (
              <a
                href={`https://linkedin.com/in/${data.linkedin.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer"
                style={{ 
                  backgroundColor: '#0A66C210',
                  borderColor: '#0A66C230',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0A66C220';
                  e.currentTarget.style.borderColor = '#0A66C2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0A66C210';
                  e.currentTarget.style.borderColor = '#0A66C230';
                }}
              >
                <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                <span className="text-base text-[#0A66C2] font-medium">{data.linkedin}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
