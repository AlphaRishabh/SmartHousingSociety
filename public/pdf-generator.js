window.onload = function () {
    // Add event listener to download bill
    document.getElementById("download-btn")
        .addEventListener("click", () => {
            const invoice = document.getElementById("print-content");

            // Ensure element exists
            if (invoice) {
                var opt = {
                    margin: 1,
                    filename: 'bill.pdf',
                    image: { type: 'jpeg', quality: 1 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                };

                // Generate PDF from content
                html2pdf().from(invoice).set(opt).save()
                    .then(() => {
                        console.log("PDF generated successfully!");
                    })
                    .catch(error => {
                        console.error("Error generating PDF:", error);
                    });
            } else {
                console.error("Element not found: print-content");
            }
        });

    // Add event listener to download receipt
    document.getElementById("download-receipt")
        .addEventListener("click", () => {
            const receipt = document.getElementById("receipt");

            // Ensure element exists
            if (receipt) {
                var opt = {
                    margin: 1,
                    filename: 'receipt.pdf',
                    image: { type: 'jpeg', quality: 1 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                };

                // Generate receipt PDF from content
                html2pdf().from(receipt).set(opt).save()
                    .then(() => {
                        console.log("Receipt PDF generated successfully!");
                    })
                    .catch(error => {
                        console.error("Error generating Receipt PDF:", error);
                    });
            } else {
                console.error("Element not found: receipt");
            }
        });
}
