const getTime = () => {
    //logic for waktu
    let waktu;
    var h = (new Date()).getHours();
    var m = (new Date()).getMinutes();
    var s = (new Date()).getSeconds();
    if (h >= 4 && h < 10) waktu = 'Pagi';
    if (h >= 10 && h < 15) waktu = 'Siang';
    if (h >= 15 && h < 18) waktu = 'Sore';
    if (h >= 18 || h < 4) waktu = 'Malam';
    return waktu;
}

module.exports = {
    getTime
}