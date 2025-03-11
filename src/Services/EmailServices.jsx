class EmailServices {
    async sendEmail(ticket)  {
        try {
            await fetch('http://localhost:8000/api/sendReceiptEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ticket:ticket})
            }).then(response => response.json()).then(data => {
                console.log(data);

            }).catch(error => {
                console.error('Error:', error);

            }).finally(() => {
                console.log('Request completed');
            });
            
        } catch (error) {
            throw error;
            
        }
    }

}

const emailService = new EmailServices();
export default emailService;