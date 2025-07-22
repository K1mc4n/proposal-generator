document.addEventListener('DOMContentLoaded', () => {
    const proposalForm = document.getElementById('proposalForm');
    const deliverablesContainer = document.getElementById('deliverablesContainer');
    const addDeliverableButton = document.getElementById('addDeliverable');
    const pricingItemsContainer = document.getElementById('pricingItemsContainer');
    const addPricingItemButton = document.getElementById('addPricingItem');
    const tanggalProposalInput = document.getElementById('tanggalProposal');
    const proposalOutputSection = document.getElementById('proposalOutput');
    const proposalContentDiv = document.getElementById('proposalContent');
    const loadingMessage = document.getElementById('loadingMessage');
    const downloadPdfButton = document.getElementById('downloadPdfButton');

    // Set current date for date input
    if (tanggalProposalInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0!
        const dd = String(today.getDate()).padStart(2, '0');
        tanggalProposalInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // Function to add dynamic fields
    const addDynamicField = (container, type, namePrefix, placeholderPrefix) => {
        const itemCount = container.querySelectorAll(`.${type}-item`).length;
        const newItem = document.createElement('div');
        newItem.className = `${type}-item form-group`;
        let innerHTML = '';

        if (type === 'deliverable') {
            innerHTML = `
                <label for="${type}${itemCount + 1}">Deliverable ${itemCount + 1}</label>
                <input type="text" id="${type}${itemCount + 1}" name="${namePrefix}" placeholder="${placeholderPrefix} Baru">
                <button type="button" class="remove-item">Hapus</button>
            `;
        } else if (type === 'pricing-item') {
            innerHTML = `
                <label for="itemLayanan${itemCount + 1}">Item/Layanan ${itemCount + 1}</label>
                <input type="text" id="itemLayanan${itemCount + 1}" name="${namePrefix}[${itemCount}][name]" placeholder="${placeholderPrefix} Baru">
                <label for="deskripsiItem${itemCount + 1}">Deskripsi</label>
                <input type="text" id="deskripsiItem${itemCount + 1}" name="${namePrefix}[${itemCount}][description]" placeholder="Deskripsi item layanan">
                <label for="kuantitas${itemCount + 1}">Kuantitas</label>
                <input type="number" id="kuantitas${itemCount + 1}" name="${namePrefix}[${itemCount}][qty]" value="1" min="1">
                <label for="hargaSatuan${itemCount + 1}">Harga Satuan</label>
                <input type="number" id="hargaSatuan${itemCount + 1}" name="${namePrefix}[${itemCount}][price]" step="0.01" placeholder="0.00">
                <button type="button" class="remove-item">Hapus</button>
            `;
        }

        newItem.innerHTML = innerHTML;
        container.appendChild(newItem);
        newItem.querySelector('.remove-item').addEventListener('click', function() {
            newItem.remove();
            // Re-index if necessary (optional, but good for clean data)
            reindexFields(container, namePrefix, type);
        });
    };

    // Re-indexing function for pricing items (more complex due to nested names)
    const reindexFields = (container, namePrefix, type) => {
        if (type === 'pricing-item') {
            container.querySelectorAll('.pricing-item').forEach((item, index) => {
                item.querySelector(`input[name^="${namePrefix}"][name$="[name]"]`).name = `${namePrefix}[${index}][name]`;
                item.querySelector(`input[name^="${namePrefix}"][name$="[description]"]`).name = `${namePrefix}[${index}][description]`;
                item.querySelector(`input[name^="${namePrefix}"][name$="[qty]"]`).name = `${namePrefix}[${index}][qty]`;
                item.querySelector(`input[name^="${namePrefix}"][name$="[price]"]`).name = `${namePrefix}[${index}][price]`;
                item.querySelector('label').textContent = `Item/Layanan ${index + 1}`;
            });
        } else if (type === 'deliverable') {
            container.querySelectorAll('.deliverable-item').forEach((item, index) => {
                item.querySelector('input').name = `${namePrefix}`; // Simple array, no index needed in name
                item.querySelector('label').textContent = `Deliverable ${index + 1}`;
            });
        }
    };


    addDeliverableButton.addEventListener('click', () => addDynamicField(deliverablesContainer, 'deliverable', 'deliverables', 'Deliverable'));
    addPricingItemButton.addEventListener('click', () => addDynamicField(pricingItemsContainer, 'pricing-item', 'pricingItems', 'Item/Layanan'));

    // Initial remove buttons for pre-existing items
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.form-group').remove();
            reindexFields(deliverablesContainer, 'deliverables', 'deliverable');
            reindexFields(pricingItemsContainer, 'pricingItems', 'pricing-item');
        });
    });


    proposalForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        loadingMessage.style.display = 'block';
        proposalOutputSection.style.display = 'none';
        proposalContentDiv.innerHTML = '';

        const formData = new FormData(proposalForm);
        const data = {};

        // Handle simple fields
        for (let [key, value] of formData.entries()) {
            // Skip dynamic array fields for now, handle them separately
            if (!key.includes('[') &&!key.includes('')) {
                data[key] = value;
            }
        }

        // Handle deliverables array
        data.deliverables = formData.getAll('deliverables');

        // Handle pricingItems array (more complex due to nested structure)
        const pricingItems =;
        const pricingItemElements = pricingItemsContainer.querySelectorAll('.pricing-item');
        pricingItemElements.forEach((item, index) => {
            const name = item.querySelector(`input[name="pricingItems[${index}][name]"]`)?.value |

| '';
            const description = item.querySelector(`input[name="pricingItems[${index}][description]"]`)?.value |

| '';
            const qty = item.querySelector(`input[name="pricingItems[${index}][qty]"]`)?.value |

| '0';
            const price = item.querySelector(`input[name="pricingItems[${index}][price]"]`)?.value |

| '0';
            pricingItems.push({
                name: name,
                description: description,
                qty: parseInt(qty),
                price: parseFloat(price)
            });
        });
        data.pricingItems = pricingItems;

        try {
            const response = await fetch('/.netlify/functions/generate-proposal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.text(); // Get HTML as text
            proposalContentDiv.innerHTML = result;
            proposalOutputSection.style.display = 'block';
        } catch (error) {
            console.error('Error generating proposal:', error);
            proposalContentDiv.innerHTML = `<p style="color: red;">Terjadi kesalahan saat membuat proposal: ${error.message}. Silakan coba lagi.</p>`;
            proposalOutputSection.style.display = 'block';
        } finally {
            loadingMessage.style.display = 'none';
        }
    });

    downloadPdfButton.addEventListener('click', () => {
        // This triggers the browser's print dialog, which can save as PDF
        window.print();
    });
});
