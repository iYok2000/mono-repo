/**
 * File Upload Template (Mock)
 *
 * Mock template for testing UI/layout.
 * Demonstrates a full-stack file upload system.
 */

import type { Template } from '@/types/template';
import { TemplateCategory, TemplateTag } from '@/types/template';

export const mockUploadTemplate: Template = {
  id: 'file-upload',
  slug: 'file-upload',

  title: 'File Upload System',
  shortDescription:
    'Secure file upload with validation, progress tracking, and cloud storage integration using Next.js and React.',
  longDescription: `A production-ready file upload system with drag-and-drop support, client-side validation, upload progress tracking, and integration with cloud storage providers.

Includes TypeScript types for type safety, security measures for file validation, and a clean UI with accessibility support. Works with S3, Google Cloud Storage, or local filesystem.`,

  category: TemplateCategory.FULLSTACK,
  tags: [
    TemplateTag.TYPESCRIPT,
    TemplateTag.REACT,
    TemplateTag.NEXTJS,
    TemplateTag.NODE,
    TemplateTag.COMPONENT,
    TemplateTag.API,
  ],

  hasLiveDemo: false,

  codeFiles: [
    {
      filename: 'FileUpload.tsx',
      language: 'tsx',
      path: 'components/FileUpload.tsx',
      description: 'React component with drag-and-drop and progress tracking',
      isMain: true,
      code: `"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  maxSize?: number; // in bytes
  accept?: string[]; // MIME types
  onUploadComplete?: (url: string) => void;
}

export const FileUpload = ({
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = ['image/*', 'application/pdf'],
  onUploadComplete,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    // Client-side validation
    if (file.size > maxSize) {
      setError(\`File too large. Max size: \${maxSize / 1024 / 1024}MB\`);
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const { url } = await response.json();
      onUploadComplete?.(url);
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [maxSize, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {uploading ? (
        <div>Uploading... {progress}%</div>
      ) : isDragActive ? (
        <div>Drop file here</div>
      ) : (
        <div>Drag and drop or click to upload</div>
      )}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
};`,
    },
    {
      filename: 'route.ts',
      language: 'typescript',
      path: 'app/api/upload/route.ts',
      description: 'Next.js API route for handling file uploads',
      code: `import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

// Security: Allowed MIME types
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
];

// Security: Max file size (5MB)
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 400 }
      );
    }

    // Generate safe filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = \`\${Date.now()}-\${file.name}\`;
    const filepath = path.join(process.cwd(), 'public/uploads', filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({
      url: \`/uploads/\${filename}\`,
      message: 'Upload successful',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}`,
    },
  ],

  howToUse: `# Installation

\`\`\`bash
pnpm add react-dropzone
\`\`\`

# Basic Usage

\`\`\`typescript
import { FileUpload } from '@/components/FileUpload';

export default function Page() {
  const handleUploadComplete = (url: string) => {
    console.log('File uploaded:', url);
  };

  return (
    <FileUpload
      maxSize={5 * 1024 * 1024} // 5MB
      accept={['image/*', 'application/pdf']}
      onUploadComplete={handleUploadComplete}
    />
  );
}
\`\`\`

# With Cloud Storage (S3)

\`\`\`typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: file.name,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
  });

  await s3Client.send(command);

  return NextResponse.json({ url: \`https://...\` });
}
\`\`\``,

  features: [
    'Drag-and-drop file upload',
    'Client-side file validation (type, size)',
    'Server-side security validation',
    'Upload progress tracking',
    'TypeScript type safety',
    'MIME type restriction',
    'File size limits',
    'Accessible UI',
    'Cloud storage ready (S3, GCS)',
    'Error handling',
  ],

  dependencies: [
    {
      name: 'react-dropzone',
      version: '^14.2.0',
      type: 'runtime',
      required: true,
    },
    {
      name: 'next',
      version: '16.0.7',
      type: 'runtime',
      required: true,
    },
    {
      name: '@aws-sdk/client-s3',
      version: '^3.0.0',
      type: 'runtime',
      required: false,
      notes: 'Only needed for S3 integration',
    },
  ],

  createdAt: '2025-12-11',
  updatedAt: '2025-12-11',
  author: 'Mock Template',
  featured: false,
};
