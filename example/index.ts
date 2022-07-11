/**
 * index.ts
 * 
 * Web API の Blob を用いて、ブラウザ上で tarball を作成し、ダウンロードさせるスクリプト。
 * 実装は以下のサイトを参考にした。
 * https://kapibara-sos.net/archives/442
 * http://www.redout.net/data/tar.html
 */
import Tar from "../tar";

(()=>{
const DEST = "download.tar"
const FILENAMES = ["test.txt", "very/long/path/Lorem_ipsum_dolor_sit_amet_consectetur_adipiscing_elit_sed_do_eiusmod_tempor_incididunt_ut_labore_et_dolore_magna_aliqua/Ut_enim_ad_minim_veniam_quis_nostrud_exercitation_ullamco_laboris_nisi_ut_aliquip_ex_ea_commodo_consequat/Duis_aute_irure_dolor_in_reprehenderit_in_voluptate_velit_esse_cillum_dolore_eu_fugiat_nulla_pariatur/Excepteur_sint_occaecat_cupidatat_non_proident_sunt_in_culpa_qui_officia_deserunt_mollit_anim_id_est_laborum/a.npy"];
const FILESRC = ["/test.txt", "/a.npy"];

//-------------------------------------
Tar.create(FILENAMES, FILESRC).then(tarBlob => {
    const tarUrl = URL.createObjectURL(tarBlob);
    const a: HTMLAnchorElement = document.createElement("a");
    a.href = tarUrl;
    a.download = DEST;
    document.body.append(a);
    a.click();
}).catch(e => console.log(e));
})();
