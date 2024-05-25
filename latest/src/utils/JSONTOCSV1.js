import fs from 'fs';
import path from 'path';

const currentDir = path.resolve();


const jsonToCsvConverter = (data) => {
    const escapeCsvValue = (value) => {
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`; // Escape quotes
        }
        return value;
      };
      
      // Create a writable stream
      const outputPath = path.join(currentDir, 'output.csv');
      const writableStream = fs.createWriteStream(outputPath);
      
      // Write headers
      writableStream.write('Emails,URL\n');
      
      // Process data and write to stream
      data.forEach(entry => {
        if (entry && entry.emails && entry.url) {
          const emails = entry.emails.join(','); // Join emails with semicolons
          const row = `${escapeCsvValue(emails)},${escapeCsvValue(entry.url)}\n`;
          writableStream.write(row);
        }
      });
      
      // Handle the finish event
      writableStream.on('finish', () => {
        console.log('CSV file created successfully.');
      });
      
      // Error handling for the stream
      writableStream.on('error', (err) => {
        console.error('Error writing to CSV file', err);
      });
      
      // Close the stream
      writableStream.end();
}

export default jsonToCsvConverter ;
