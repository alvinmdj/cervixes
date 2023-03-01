import type { OptionType } from "pages/diagnose";

const ModalDiagnoseResult = ({
  result,
  openResultModal,
  handleCloseResultModal,
}: {
  result: OptionType[];
  openResultModal: boolean;
  handleCloseResultModal: () => void;
}) => {
  let highest: OptionType = {
    id: "",
    name: "",
    diseases: [],
    weight: 0,
  };
  let disease = "Tidak mengalami kanker serviks";

  if (result.length) {
    highest = result.reduce((prev, current) => {
      return prev.weight > current.weight ? prev : current;
    });

    if (highest.diseases.length) {
      disease = "mengalami indikasi " + highest.diseases.join(" & ");
    }
  }

  return (
    <>
      <input
        type="checkbox"
        id="my-modal-5"
        className="modal-toggle"
        checked={openResultModal}
        onChange={() => {
          return;
        }}
      />
      <div className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="mb-3 text-center text-2xl font-bold">
            Hasil Diagnosis
          </h3>
          <div className="mb-3">
            <p className="text-lg font-bold">Keterangan</p>
            <p>
              Berdasarkan hasil diagnosis sistem pakar, Anda terdiagnosis{" "}
              <strong className="lowercase">{disease}</strong> dengan
              nilai kepercayaan sebesar{" "}
              <strong>{(highest.weight * 100).toFixed(2)}%</strong>.
            </p>
          </div>

          <div className="mb-3">
            <p className="text-lg font-bold">Hal yang dapat Anda lakukan</p>
            <p>
              Untuk memperoleh hasil diagnosis yang lebih menyeluruh, Anda tetap
              perlu melakukan pemeriksaan secara langsung ke pusat kesehatan di
              wilayah Anda. Diagnosis kanker serviks yang lebih pasti dapat
              dilakukan dengan beberapa metode seperti melakukan{" "}
              <i>screening</i> menggunakan metode <i>papsmear</i>, inspeksi asam
              asetat, ataupun melakukan pengujian DNA HPV. Untuk diagnosis lebih
              lanjut, dapat dilakukan biopsi serviks.
            </p>
          </div>

          <div className="mb-3">
            <p className="text-lg font-bold">
              Tindak pencegahan kanker serviks
            </p>
            <p>
              Untuk mencegah terkena kanker serviks, pastikan untuk menghindari
              faktor-faktor risiko yang tertera pada daftar pilihan faktor
              risiko. Anda juga dapat melakukan vaksin HPV yang sangat
              disarankan untuk mulai dilakukan sejak usia 9 tahun sebanyak 3
              kali. Vaksinasi HPV dapat memperkecil kemungkinan Anda terkena
              kanker serviks.
            </p>
          </div>

          <div className="mb-3">
            <p className="text-lg font-bold">
              Tindak penanganan kanker serviks
            </p>
            <p>
              Untuk penanganan kanker serviks, pastikan Anda melakukan
              konsultasi langsung dengan dokter yang ahli di bidang kanker
              serviks. Pada stadium awal, Anda dapat melakukan krioterapi
              apabila kanker masih belum menyebar. Pastikan untuk tetap
              melakukan pengecekan secara rutin meski sudah selesai krioterapi.
              Pada stadium lanjut, hal yang dapat Anda lakukan adalah dengan
              penyinaran radiasi untuk mematikan sel-sel kanker.
            </p>
          </div>
          <div className="modal-action">
            <button onClick={handleCloseResultModal} className="btn">
              Kembali
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalDiagnoseResult;
