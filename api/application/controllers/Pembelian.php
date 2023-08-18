<?php
use Restserver\Libraries\REST_Controller;
defined("BASEPATH") or exit("No direct script access allowed");
require APPPATH . "libraries/REST_Controller.php";
require APPPATH . "libraries/Format.php";

class Pembelian extends REST_Controller
{
    function __construct()
    {
        parent::__construct();
        $this->load->model('Pembelian_model', 'produk');
    }

    function list_post()
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header('Content-Type: application/json');
        
        $search = $this->input->post('search', TRUE);
        $limit = $this->input->post('limit', TRUE);
        $start = $this->input->post('start', TRUE);
        $produk = $this->produk->fetch_data($limit, $start, $search);
        
        if ($produk->num_rows() == 0 && $this->input->post('start') == 0)
        {
            $result = 0;
        } else {
            $result = 1;
        }
        if ($produk->num_rows() > 0) {
                $this->response([
                'status' => TRUE,
                'data' => $produk->result(),
                'result' => $result,
                'banyak'=>$produk->num_rows(),
            ], REST_Controller::HTTP_OK);
        } else {
            $this->response([
                'status' => FALSE,
                'message' => 'Pembelian tidak ditemukan',
                'result' => $result,
                'banyak'=>$produk->num_rows(),
            ], REST_Controller::HTTP_OK);
        }
    }

    public function simpan_post()
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods:POST");
        header("Content-Type: application/json");
        $id = $this->input->post("id", true);

        $data = [
            "kost_id" => $this->input->post("kost_id", true),
            "nama" => $this->input->post("nama", true),
            "no_hp" => $this->input->post("no_hp",true),
        ];

        $this->db->insert("pembelian", $data);
        $msg = "Data Pembelian berhasil ditambahkan";
        echo json_encode(["status" => true, "message" => $msg]);
    }

}