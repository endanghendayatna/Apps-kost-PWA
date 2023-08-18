let limit = 4;
let start = 0;
let action = 'inactive';
let search = '';
let result = 1;
// fungsi ini digunakan untuk me routing halaman utama sehingga pada
// saat aplikasi pertama dijalankan , konten home akan langsung dibuka
$(document).ready(function () {
	home();
	$('#home').addClass('active');
	$('#kost').removeClass('active');
	$('#pembelian').removeClass('active');
	$('#profil').removeClass('active');
	$('#tambah').show();
});

//fungsi ini digunakan sebagai router halaman konten home
function home() {
	$.ajax({
		type: 'GET',
		url: 'home.html',
		data: 'data',
		dataType: 'html',
		success: function (response) {
			$('#content').html(response);
			$('#home').addClass('active');
			$('#kost').removeClass('active');
			$('#pembelian').removeClass('active');
			$('#profil').removeClass('active');
			$('#tambah').show();

			$('#load_data').html('');
			start = 0;
			lazzy_loader(limit);
			if (action == 'inactive') {
				action = 'active';
				fetching_data(limit, start, search);
			}
		},
	});
}

//fungsi ini digunakan sebagai router halaman konten kost
function kost() {
	$.ajax({
		type: 'GET',
		url: 'kost.html',
		data: 'data',
		dataType: 'html',
		success: function (response) {
			$('#content').html(response);
			$('#home').removeClass('active');
			$('#kost').addClass('active');
			$('#pembelian').removeClass('active');
			$('#profil').removeClass('active');
			$('#tambah').show();

			$('#load_data').html('');
			start = 0;
			lazzy_loader(limit);
			if (action == 'inactive') {
				action = 'active';
				fetching_data(limit, start, search);
			}
		},
	});
}

function pembelian() {
	$.ajax({
		type: 'GET',
		url: 'pembelian.html',
		data: 'data',
		dataType: 'html',
		success: function (response) {
			$('#content').html(response);
			$('#home').removeClass('active');
			$('#kost').removeClass('active');
			$('#pembelian').addClass('active');
			$('#profil').removeClass('active');
			$('#tambah').hide();
			$('#load_data').html('');
			fetching_data_pembelian();
		},
	});
}

//fungsi ini digunakan sebagai router halaman konten profil
function profil() {
	$.ajax({
		type: 'GET',
		url: 'profil.html',
		data: 'data',
		dataType: 'html',
		success: function (response) {
			$('#content').html(response);
			$('#home').removeClass('active');
			$('#kost').removeClass('active');
			$('#pembelian').removeClass('active');
			$('#profil').addClass('active');
			$('#tambah').hide();
		},
	});
}

//fungsi ini digunakan untuk menampilkan alert informasi menggunakan library sweetalert2
function info() {
	Swal.fire({
		title: 'Info',
		text: 'My kost Apllication',
		icon: 'info',
		confirmButtonText: 'Tutup',
		confirmButtonColor: '#3085d6',
	});
}

//fungsi ini digunakan untuk mengambil data barang dari database melalui API
function fetching_data_pembelian() {
	console.log('jalan');
	$.ajax({
		type: 'POST',
		url: 'https://kostan123.000webhostapp.com/pembelian/list?search=' + $('#search').val(),
		dataType: 'JSON',
		success: function (response) {
			$('#load_data').html('');
			if (response.status) {
				let card_data = '';
				$.each(response.data, function (i, v) {
					card_data += ` 
						<div class="col-12 card mb-3" style="background-color:skyblue">
							<div class="card-body">
								<h4 class="semibold m-0 px-2 text-white mb-1">Pembelian_${v.id} - ${v.nama}</h4>
								<h5 class="semibold text-dark m-0 px-2">Pembeli : ${v.nama}</h5>
								<p class="text-dark m-0 px-2">${v.alamat}</p>
								<hr/>
								<div class="row text-dark">
									<div class="col-7"><p class="semibold m-0 px-2">Kasur </p></div>
									<div class="col-5"><span>: ${v.kasur}</span></div>
									<div class="col-7"><p class="semibold m-0 px-2">Lemari </p></div>
									<div class="col-5"><span>: ${v.lemari}</span></div>
									<div class="col-7"><p class="semibold m-0 px-2">Wifi </p></div>
									<div class="col-5"><span>: ${v.wifi}</span></div>
									<div class="col-7"><p class="semibold m-0 px-2">Kamar Mandi</p></div>
									<div class="col-5"><span>: ${v.kamar_mandi}</span></div>
								</div>
								<hr/>
								<p class="m-0 px-2 text-primary">${v.no_hp}</p>
								<p class="m-0 px-2 text-success">${'Rp.' + numFormat(v.harga)}</p>
							</div>
						</div>
					`;
					$('#load_data').html(card_data);
				});
				console.log(response);
			} else {
				$('#load_data').html('<div class="col-12 text-center"><h4 class="text-danger">Oops, barang yang anda cari tidak di temukan</h4></div>');
				console.log(response);
			}
		},
	});
}

//fungsi ini digunakan untuk mem format angka kedalam format curency
function numFormat(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function mdOpen() {
	$('#md-pembelian').modal('hide');
	$('#md-barang').modal('hide');
	$('#md-detail').modal('hide');
	$('#md-barang').modal('show');
	$('#md-barang-title').html('Tambah kost');
	$('#image').attr('required', true);
	$('#form-barang')[0].reset();
}

$(function () {
	// when the form is submitted
	$('#form-barang').on('submit', function (e) {
		// if the validator does not prevent form submit
		if (!e.isDefaultPrevented()) {
			Swal.fire('Sedang menyimpan data');
			Swal.showLoading();

			$('#btnSubmit').text('Menyimpan...');
			$('#btnSubmit').attr('disabled', true);
			var formData = new FormData($('#form-barang')[0]);
			$.ajax({
				url: 'https://kostan123.000webhostapp.com/produk/simpan',
				type: 'POST',
				data: formData,
				contentType: false,
				processData: false,
				dataType: 'JSON',
				success: function (data) {
					if (data.status) {
						$('#form-barang')[0].reset();
						$('#md-barang').modal('hide');
						fetching_data(limit, start, search);

						Swal.fire({
							text: data.message,
							icon: 'success',
							confirmButtonText: 'Ok',
						});
					} else {
						Swal.fire({
							text: data.message,
							icon: 'error',
							confirmButtonText: 'Ok',
						});
					}
					$('#btnSubmit').text('Simpan');
					$('#btnSubmit').attr('disabled', false);
				},
			});

			return false;
		}
	});
});

function dialog(id) {
	$('#md-pembelian').modal('hide');
	$('#md-barang').modal('hide');
	$('#md-dialog').modal('show');
	$('#md-detail').modal('hide');
	$('#btnBeli').attr('data-id', id);
	$('#btnDetail').attr('data-id', id);
	$('#btnEdit').attr('data-id', id);
	$('#btnHapus').attr('data-id', id);

	$.ajax({
		type: 'GET',
		url: 'https://kostan123.000webhostapp.com/produk/detail/' + id,
		dataType: 'JSON',
		success: function (response) {
			if (response.status) {
				$('#id').val(response.data.id);
				$('#nama').val(response.data.nama);
				$('#harga').val(response.data.harga);
				$('#alamat').val(response.data.alamat);
				$('#kasur').val(response.data.kasur);
				$('#lemari').val(response.data.lemari);
				$('#wifi').val(response.data.wifi);
				$('#kamar_mandi').val(response.data.kamar_mandi);
			} else {
				Swal.fire({
					text: response.message,
					icon: 'error',
					confirmButtonText: 'Ok',
				});
			}
		},
	});
}

function edit(id) {
	$('#form-barang')[0].reset();
	$('#md-dialog').modal('hide');
	$('#md-detail').modal('hide');
	$('#md-barang').modal('show');
	$('#md-pembelian').modal('hide');
	$('#md-barang-title').html('Edit Barang');
	$('#image').attr('required', false);

	$.ajax({
		type: 'GET',
		url: 'https://kostan123.000webhostapp.com/produk/detail/' + id,
		dataType: 'JSON',
		success: function (response) {
			if (response.status) {
				$('#id').val(response.data.id);
				$('#nama').val(response.data.nama);
				$('#harga').val(response.data.harga);
				$('#alamat').val(response.data.alamat);
				$('#kasur').val(response.data.kasur);
				$('#lemari').val(response.data.lemari);
				$('#wifi').val(response.data.wifi);
				$('#kamar_mandi').val(response.data.kamar_mandi);
			} else {
				Swal.fire({
					text: response.message,
					icon: 'error',
					confirmButtonText: 'Ok',
				});
			}
		},
	});
}

function detail(id) {
	$('#form-barang')[0].reset();
	$('#md-dialog').modal('hide');
	$('#md-detail').modal('show');
	$('#md-barang').modal('hide');
	$('#md-pembelian').modal('hide');

	$.ajax({
		type: 'GET',
		url: 'https://kostan123.000webhostapp.com/produk/detail/' + id,
		dataType: 'JSON',
		success: function (response) {
			if (response.status) {
				$('#dt-img').css('background-image', 'url(' + response.data.img + ')');
				$('#dt-nama').html(response.data.nama);
				$('#dt-harga').html('Rp.' + numFormat(response.data.harga));
				$('#dt-alamat').html(response.data.alamat);
				$('#dt-kasur').html(response.data.kasur);
				$('#dt-lemari').html(response.data.lemari);
				$('#dt-wifi').html(response.data.wifi);
				$('#dt-kamar_mandi').html(response.data.kamar_mandi);
			} else {
				Swal.fire({
					text: response.message,
					icon: 'error',
					confirmButtonText: 'Ok',
				});
			}
		},
	});
}

function mdPembelian(id) {
	$('#md-pembelian').modal('show');
	$('#md-barang').modal('hide');
	$('#md-detail').modal('hide');
	$('#md-barang').modal('hide');
	$('#md-dialog').modal('hide');

	$.ajax({
		type: 'GET',
		url: 'https://kostan123.000webhostapp.com/produk/detail/' + id,
		dataType: 'JSON',
		success: function (response) {
			if (response.status) {
				$('#kost_id').val(response.data.id);
			} else {
				Swal.fire({
					text: response.message,
					icon: 'error',
					confirmButtonText: 'Ok',
				});
			}
		},
	});
}

$(function () {
	// when the form is submitted
	$('#form-barang').on('submit', function (e) {
		// if the validator does not prevent form submit
		if (!e.isDefaultPrevented()) {
			Swal.fire('Sedang menyimpan data');
			Swal.showLoading();

			$('#btnSubmit').text('Menyimpan...');
			$('#btnSubmit').attr('disabled', true);
			var formData = new FormData($('#form-barang')[0]);
			$.ajax({
				url: 'https://kostan123.000webhostapp.com/produk/simpan',
				type: 'POST',
				data: formData,
				contentType: false,
				processData: false,
				dataType: 'JSON',
				success: function (data) {
					if (data.status) {
						$('#form-barang')[0].reset();
						$('#md-barang').modal('hide');
						fetching_data(limit, start, search);

						Swal.fire({
							text: data.message,
							icon: 'success',
							confirmButtonText: 'Ok',
						});
					} else {
						Swal.fire({
							text: data.message,
							icon: 'error',
							confirmButtonText: 'Ok',
						});
					}
					$('#btnSubmit').text('Simpan');
					$('#btnSubmit').attr('disabled', false);
				},
			});

			return false;
		}
	});

	$('#form-pembelian').on('submit', function (e) {
		// if the validator does not prevent form submit
		if (!e.isDefaultPrevented()) {
			Swal.fire('Sedang menyimpan data');
			Swal.showLoading();

			$('#btnSubmit').text('Menyimpan...');
			$('#btnSubmit').attr('disabled', true);
			var formData = new FormData($('#form-pembelian')[0]);
			$.ajax({
				url: 'https://kostan123.000webhostapp.com/pembelian/simpan',
				type: 'POST',
				data: formData,
				contentType: false,
				processData: false,
				dataType: 'JSON',
				success: function (data) {
					if (data.status) {
						$('#form-pembelian')[0].reset();
						$('#md-pembelian').modal('hide');
						fetching_data(limit, start, search);

						Swal.fire({
							text: data.message,
							icon: 'success',
							confirmButtonText: 'Ok',
						});
					} else {
						Swal.fire({
							text: data.message,
							icon: 'error',
							confirmButtonText: 'Ok',
						});
					}
					$('#btnSubmit').text('Beli');
					$('#btnSubmit').attr('disabled', false);
				},
			});

			return false;
		}
	});
});

function hapus(id) {
	Swal.fire({
		title: 'Data Barang Akan Dihapus?',
		text: 'Data yang di hapus tidak dapat di kembalikan',
		icon: 'question',
		showCancelButton: true,
		confirmButtonText: 'Hapus',
		confirmButtonColor: '#3085d6',
		cancelButtonText: 'Batal',
		cancelButtonColor: '#d33',
	}).then((result) => {
		if (result.isConfirmed) {
			Swal.fire('Sedang menghapus data');
			Swal.showLoading();
			$.ajax({
				type: 'GET',
				url: 'https://kostan123.000webhostapp.com/produk/hapus/' + id,
				dataType: 'JSON',
				success: function (response) {
					if (response.status) {
						Swal.fire({
							text: response.message,
							icon: 'success',
							confirmButtonText: 'Ok',
						});
						fetching_data(limit, start, search);
						$('#md-dialog').modal('hide');
					} else {
						Swal.fire({
							text: response.message,
							icon: 'error',
							confirmButtonText: 'Ok',
						});
					}
				},
			});
		}
	});
}

function fetching_data(limit, start, search) {
	// $('#load_data').html('');
	$.ajax({
		url: 'https://kostan123.000webhostapp.com/produk/list',
		method: 'POST',
		data: {
			limit: limit,
			start: start,
			search: search,
		},
		dataType: 'JSON',
		cache: false,
		success: function (response) {
			result = response.result;
			if (response.status) {
				let card_data = '';
				$.each(response.data, function (i, v) {
					card_data = ` 
					<a class="product-items" href="javascript:void(0)" onclick="dialog('${v.id}');" style="background-color:skyblue">
						<div class="product-cover mb-2" style="background-image: url('${v.img}');"></div>
						<h2 class="semibold m-0 px-2 text-white">${v.nama}</h2>
						<h5 class="semibold m-0 px-2 text-white">${v.alamat}</h5>
						<hr/>
						<div class="row text-dark">
							<div class="col-7"><p class="semibold m-0 px-2">Kasur </p></div>
							<div class="col-5"><span>: ${v.kasur}</span></div>
							<div class="col-7"><p class="semibold m-0 px-2">Lemari </p></div>
							<div class="col-5"><span>: ${v.lemari}</span></div>
							<div class="col-7"><p class="semibold m-0 px-2">Wifi </p></div>
							<div class="col-5"><span>: ${v.wifi}</span></div>
							<div class="col-7"><p class="semibold m-0 px-2">Kamar Mandi</p></div>
							<div class="col-5"><span>: ${v.kamar_mandi}</span></div>
						</div>
						<p class="caption m-0 py-1 px-2 text-white">Rp. ${numFormat(v.harga)}</p>
					</a>`;
					$('#load_data').append(card_data);
				});

				action = 'inactive';
				$('#load_data_message').html('');
				console.log(response);
			} else {
				$('#load_data').html('');
				$('#load_data_message').html('<div class="col-12 text-center"><h4 class="text-danger">Oops, barang yang anda cari tidak di temukan</h4></div>');
				action = 'active';
				console.log(response);
			}
		},
	});
}

function lazzy_loader(limit) {
	var output = '';

	for (var count = 0; count < limit; count++) {
		output += `
			<a class="product-items w-50 flex-column shimmer" style="background-color:skyblue" href="javascript:void(0)">
				<div class="product-cover animate mb-2" ></div>
				<p class="bodytext1 semibold m-0 px-2 text-secondary animate mb-2"></p>
				<p class="bodytext2 color-black300 m-0 px-2 animate mb-2"></p>
				<p class="caption m-0 py-1 px-2 text-primary animate"></p>
			</a>`;
	}

	$('#load_data_message').html(output);
}

$(window).scroll(function () {
	if ($(window).scrollTop() + $(window).height() > $('#load_data').height() && action == 'inactive' && result == 1) {
		lazzy_loader(limit);
		action = 'active';
		start = start + limit;
		setTimeout(function () {
			fetching_data(limit, start, search);
		}, 1000);
	}
});

function searchHandler() {
	$('#load_data').html('');
	search = $('#search').val();
	fetching_data(limit, start, search);
}
