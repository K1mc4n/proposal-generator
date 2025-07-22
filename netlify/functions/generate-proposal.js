// The HTML template for the proposal, embedded as a string.
// This is the same HTML structure provided in the research report's example.
const proposalTemplate = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{JudulProposal}}</title>
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
      .container { max-width: 800px; margin: 20px auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee; }
        header h1 { color: #0056b3; margin-bottom: 10px; }
        header p { font-size: 0.9em; color: #666; }
        section { margin-bottom: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0; }
        section:first-of-type { border-top: none; }
        h2 { color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 5px; margin-bottom: 15px; }
        h3 { color: #0056b3; margin-top: 20px; margin-bottom: 10px; }
      .contact-info,.company-details,.pricing-table { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 15px; }
      .pricing-table table { width: 100%; border-collapse: collapse; margin-top: 15px; }
      .pricing-table th,.pricing-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
      .pricing-table th { background-color: #e9e9e9; }
      .signature-block { margin-top: 50px; text-align: right; }
      .signature-block p { margin-bottom: 5px; }
      .signature-line { border-bottom: 1px solid #333; width: 200px; display: inline-block; margin-top: 30px; }
        footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.8em; color: #888; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>{{JudulProposal}}</h1>
            <p>Untuk: <strong>{{NamaKlien}}</strong></p>
            <p>Dari: <strong>{{NamaPerusahaanAnda}}</strong></p>
            <p>Tanggal: {{TanggalProposal}}</p>
        </header>

        <section id="executive-summary">
            <h2>Ringkasan Eksekutif</h2>
            <p>{{RingkasanEksekutif}}</p>
        </section>

        <section id="company-profile">
            <h2>Profil Perusahaan</h2>
            <div class="company-details">
                <p><strong>Nama Perusahaan:</strong> {{NamaPerusahaanAnda}}</p>
                <p><strong>Alamat:</strong> {{AlamatPerusahaanAnda}}</p>
                <p><strong>Telepon:</strong> {{TeleponPerusahaanAnda}}</p>
                <p><strong>Email:</strong> {{EmailPerusahaanAnda}}</p>
                <p><strong>Visi:</strong> {{VisiPerusahaan}}</p>
                <p><strong>Misi:</strong> {{MisiPerusahaan}}</p>
            </div>
            <p>{{DeskripsiPerusahaan}}</p>
        </section>

        <section id="problem-solution">
            <h2>Masalah & Solusi</h2>
            <h3>Masalah yang Dihadapi Klien</h3>
            <p>{{MasalahKlien}}</p>
            <h3>Solusi yang Kami Tawarkan</h3>
            <p>{{SolusiKami}}</p>
        </section>

        <section id="scope-of-work">
            <h2>Lingkup Pekerjaan</h2>
            <p>{{LingkupPekerjaanDeskripsi}}</p>
            <h3>Deliverables</h3>
            <ul>
                {{DeliverablesList}}
            </ul>
            <h3>Jadwal Proyek</h3>
            <p>{{JadwalProyekDeskripsi}}</p>
        </section>

        <section id="pricing">
            <h2>Investasi</h2>
            <div class="pricing-table">
                <table>
                    <thead>
                        <tr>
                            <th>Item/Layanan</th>
                            <th>Deskripsi</th>
                            <th>Kuantitas</th>
                            <th>Harga Satuan</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{PricingItemsTableRows}}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4" style="text-align: right;"><strong>Total Investasi:</strong></td>
                            <td><strong>{{TotalInvestasi}}</strong></td>
                        </tr>
                    </tfoot>
                </table>
                <p style="margin-top: 15px;"><em>Catatan: {{CatatanHarga}}</em></p>
            </div>
        </section>

        <section id="terms-conditions">
            <h2>Syarat dan Ketentuan</h2>
            <p>{{SyaratKetentuan}}</p>
        </section>

        <section id="social-proof">
            <h2>Bukti Sosial / Testimonial</h2>
            <blockquote>
                <p>"{{TestimonialKlien}}"</p>
                <cite>- {{NamaKlienTestimonial}}, {{JabatanKlienTestimonial}}</cite>
            </blockquote>
        </section>

        <section id="conclusion">
            <h2>Penutup</h2>
            <p>{{PenutupProposal}}</p>
            <div class="signature-block">
                <p>Hormat kami,</p>
                <div class="signature-line"></div>
                <p><strong>{{NamaPenanggungJawab}}</strong></p>
                <p>{{JabatanPenanggungJawab}}</p>
                <p>{{NamaPerusahaanAnda}}</p>
            </div>
        </section>

        <footer>
            <p>&copy; {{TahunSekarang}} {{NamaPerusahaanAnda}}. Hak Cipta Dilindungi Undang-Undang.</p>
        </footer>
    </div>
</body>
</html>
`;

exports.handler = async (event) => {
    if (event.httpMethod!== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);

        // Basic sanitization (IMPORTANT: For production, use a dedicated HTML sanitization library)
        // This simple replace is not sufficient for robust security against XSS.
        const escapeHtml = (text) => {
            if (typeof text!== 'string') return text;
            return text
               .replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
        };

        let filledTemplate = proposalTemplate;

        // Replace simple placeholders
        for (const key in data) {
            if (typeof data[key] === 'string' |

| typeof data[key] === 'number') {
                filledTemplate = filledTemplate.replace(new RegExp(`{{${key}}}`, 'g'), escapeHtml(data[key]));
            }
        }

        // Handle dynamic DeliverablesList
        let deliverablesHtml = '';
        if (data.deliverables && Array.isArray(data.deliverables)) {
            deliverablesHtml = data.deliverables.map(item => `<li>${escapeHtml(item)}</li>`).join('');
        }
        filledTemplate = filledTemplate.replace('{{DeliverablesList}}', deliverablesHtml);

        // Handle dynamic PricingItemsTableRows
        let pricingItemsHtml = '';
        let totalInvestasi = 0;
        if (data.pricingItems && Array.isArray(data.pricingItems)) {
            pricingItemsHtml = data.pricingItems.map(item => {
                const itemTotal = (item.qty |

| 0) * (item.price |
| 0);
                totalInvestasi += itemTotal;
                return `
                    <tr>
                        <td>${escapeHtml(item.name |

| '')}</td>
                        <td>${escapeHtml(item.description |

| '')}</td>
                        <td>${escapeHtml(item.qty |

| '')}</td>
                        <td>${escapeHtml(item.price? item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : '')}</td>
                        <td>${escapeHtml(itemTotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) |

| '')}</td>
                    </tr>
                `;
            }).join('');
        }
        filledTemplate = filledTemplate.replace('{{PricingItemsTableRows}}', pricingItemsHtml);
        filledTemplate = filledTemplate.replace('{{TotalInvestasi}}', escapeHtml(totalInvestasi.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })));


        // Handle current year
        filledTemplate = filledTemplate.replace('{{TahunSekarang}}', new Date().getFullYear().toString());

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/html' },
            body: filledTemplate,
        };
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to generate proposal', details: error.message }),
        };
    }
};
