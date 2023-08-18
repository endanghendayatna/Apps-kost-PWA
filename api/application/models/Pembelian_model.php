<?php
defined("BASEPATH") or exit("No direct script access allowed");
class Pembelian_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
    }

    function fetch_data($limit, $start, $search)
    {
        $this->db->select("*, kost.id as id_kost");
        $this->db->from("pembelian");
        $this->db->join('kost', 'kost.id = pembelian.kost_id');
        $this->db->limit($limit, $start);
        $this->db->order_by("pembelian.id", "ASC");
        return $this->db->get();
    }
}