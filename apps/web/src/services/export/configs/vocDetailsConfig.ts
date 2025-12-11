import type { ExportConfig, VocExportData } from '../types';
import { ExportType } from '../types';

export const vocDetailsConfig: ExportConfig<VocExportData> = {
  type: ExportType.VOC_DETAILS,
  name: 'รายละเอียดเสียงของลูกค้า',
  filenamePrefix: 'voc-details',

  columns: [
    { key: 'no', header: 'ลำดับ' },
    { key: 'vocNo', header: 'หมายเลขเคลม' },
    { key: 'peaOffice', header: 'หน่วยงาน' },
    { key: 'refNoPea', header: 'เลขที่อ้างอิง' },

    { key: 'workingDaysOpen', header: 'วันทำการที่เปิด' },
    { key: 'calendarDaysOpen', header: 'วันปฏิทินที่เปิด' },
    { key: 'dateSentPea', header: 'วันเวลาที่ส่ง PEA' },
    { key: 'dateFirstContact', header: 'วันเวลาติดต่อครั้งแรก' },
    { key: 'datePeaReceived', header: 'วันเวลาที่ PEA รับเรื่อง' },
    { key: 'datePeaCompleted', header: 'วันเวลาที่ PEA ดำเนินการเสร็จ' },
    { key: 'daysToAccept', header: 'จำนวนวันในการรับเรื่อง' },
    { key: 'dateClosed', header: 'วันปิดเรื่อง' },

    { key: 'customerName', header: 'ชื่อลูกค้า' },
    { key: 'customerCode', header: 'รหัสลูกค้า' },
    { key: 'customerGroup', header: 'กลุ่มลูกค้า' },
    { key: 'customerType', header: 'ประเภทลูกค้า' },

    { key: 'channel', header: 'ช่องทาง' },
    { key: 'requestType', header: 'ประเภทคำขอ' },
    { key: 'topic', header: 'หัวข้อ' },
    { key: 'issue', header: 'ปัญหา' },
    { key: 'subIssue', header: 'ปัญหาย่อย' },

    { key: 'rootCause', header: 'สาเหตุรากฐาน' },
    { key: 'incidentLocation', header: 'สถานที่เกิดเหตุ' },

    { key: 'phone', header: 'เบอร์โทร' },
    { key: 'email', header: 'อีเมล' },
    { key: 'contactLocation', header: 'สถานที่ติดต่อ' },

    { key: 'details', header: 'รายละเอียด' },
    { key: 'cause', header: 'สาเหตุ' },
    { key: 'solution', header: 'วิธีแก้ไข' },
    { key: 'result', header: 'ผลลัพธ์' },
    { key: 'consent', header: 'ความยินยอม' },

    { key: 'status', header: 'สถานะ' },
    { key: 'satisfaction', header: 'ความพึงพอใจ' },
    { key: 'changedFrom', header: 'เปลี่ยนจาก' },
    { key: 'trackingStatus', header: 'สถานะการติดตาม' },
  ],
};
