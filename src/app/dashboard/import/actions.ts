
'use server';

import * as XLSX from 'xlsx';

export async function getSampleFile() {
    const data = [
        {
            firstName: 'John',
            lastName: 'Doe',
            emails: 'john.doe@example.com, john.d@work.com',
            phones: '123-456-7890 (Mobile), 098-765-4321 (Telephone)',
            organization: 'Acme Inc.',
            designation: 'Lead Engineer',
            team: 'Platform',
            department: 'Engineering',
            address: '123 Main St, Anytown, USA',
            website: 'https://johndoe.com',
            socialMedia: 'https://linkedin.com/in/johndoe',
            birthday: '1990-05-15',
            subordinateName: 'Jane Smith',
            notes: 'Met at the 2023 tech conference.'
        },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
    
    // Set column widths
    worksheet['!cols'] = [
        { wch: 15 }, { wch: 15 }, { wch: 40 }, { wch: 40 },
        { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
        { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 15 },
        { wch: 20 }, { wch: 40 }
    ];

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    
    return {
        file: buffer.toString('base64'),
        fileName: 'sample-contact-import.xlsx',
    };
}
