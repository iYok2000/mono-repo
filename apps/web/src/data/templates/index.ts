import { initializeTemplates } from "@/services/templateService";
import { dataExportTemplate } from "./data-export";
import { mockAuthTemplate } from "./mock-auth";
import { mockUploadTemplate } from "./mock-upload";

export const allTemplates = [
  dataExportTemplate,
  mockAuthTemplate,
  mockUploadTemplate,
];

export const initializeTemplateRegistry = () => {
  initializeTemplates(allTemplates);
};

if (typeof window !== "undefined") {
  initializeTemplateRegistry();
} else {
  initializeTemplateRegistry();
}

export { dataExportTemplate } from "./data-export";
export { mockAuthTemplate } from "./mock-auth";
export { mockUploadTemplate } from "./mock-upload";
