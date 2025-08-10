import { jsPDF } from "jspdf";

// Default export is a4 paper, portrait, using millimeters for units
// A4 is 210mm x 297mm or 595pt x 842pt

const doc = new jsPDF();


doc.text("Hello world!", 10, 10);
doc.save("a4.pdf");