AOS.init();

document.getElementById('search-button').addEventListener('click', async function() {
    const info = document.querySelector('.info');
    const searchInput = document.getElementById('search-input');
    const kurir = document.querySelector('.kurir').value;

    info.classList.remove('col-md-10');
    info.classList.add('col-md-12', 'text-center');
    info.innerHTML = `
        <div class="spinner-border text-primary mt-5" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;

    try {
        const response = await fetch(`https://api.binderbyte.com/v1/track?api_key=1d7f2b73e0f95e85f9726b670f57be1f6975fec321cb815d1b76db75a7f68374&courier=${kurir}&awb=${searchInput.value}`);
        const result = await response.json();

        if(result.status === 200 && result.data) {
            const summary = result.data.summary;
            const detail = result.data.detail;
            const history = result.data.history.reverse();
            const tanggalKirim = history[0]?.date || '-';

            info.classList.remove('text-center');
            info.innerHTML = `
                <div data-aos="zoom-in-down">
                <h4 class="mb-2">I. Informasi Pengiriman</h4>
                <table class="table">
                    <tbody>
                        <tr><th>No.Resi</th><td>:</td><td>${summary.awb}</td></tr>
                        <tr><th>Status</th><td>:</td><td>${summary.status}</td></tr>
                        <tr><th>Service</th><td>:</td><td>${summary.service}</td></tr>
                        <tr><th>Tanggal pengiriman</th><td>:</td><td>${tanggalKirim}</td></tr>
                        <tr><th>Pengirim</th><td>:</td><td>${detail.shipper} <br> ${detail.origin}</td></tr>
                        <tr><th>Penerima</th><td>:</td><td>${detail.receiver} <br> ${detail.destination}</td></tr>
                    </tbody>
                </table>

                <h4 class="mb-2">II. Status Pengiriman</h4>
                <table class="table">
                    <thead>
                        <tr class="text-center"><th>Tanggal</th><th>Keterangan</th></tr>
                    </thead>
                    <tbody>
                        ${history.map(item => `<tr><td>${item.date}</td><td>${item.desc}</td></tr>`).join('')}
                    </tbody>
                </table>
                </div>
            `;
            searchInput.value = '';
        } else {
            showError("Nomor resi tidak ada, mohon periksa lagi nomor resi / jasa pengiriman yang dipilih !");
        }

    } catch(err) {
        showError("Terjadi kesalahan server, silakan coba lagi nanti.");
    }
});

function showError(message) {
    const info = document.querySelector('.info');
    info.classList.remove('col-md-12', 'text-center');
    info.classList.add('col-md-8');
    info.innerHTML = `
        <div class="alert alert-danger" role="alert">${message}</div>
    `;
}