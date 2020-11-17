export function convertDateToTimeStamp(date) {
    date = new Date(date.getTime());
    var date_format_str = date.getFullYear().toString() + "-" + ((date.getMonth() + 1).toString().length == 2 ? (date.getMonth() + 1).toString() : "0" + (date.getMonth() + 1).toString()) + "-" + (date.getDate().toString().length == 2 ? date.getDate().toString() : "0" + date.getDate().toString()) + " " + (date.getHours().toString().length == 2 ? date.getHours().toString() : "0" + date.getHours().toString()) + ":" + ((parseInt(date.getMinutes() / 5) * 5).toString().length == 2 ? (parseInt(date.getMinutes() / 5) * 5).toString() : "0" + (parseInt(date.getMinutes() / 5) * 5).toString()) + ":00";
    return date_format_str;
}

export function getDataForAllCategories(timestamp1, timestamp2) {
    fetch(`http://localhost:5000/damage/mean/allcategories/${timestamp1}/${timestamp2}`)
        .then((response) => {
            response.json().then(function (data) {
                let temp0 = data.reduce((ans, val) => {
                    return { ...ans, [val['0']]: {} };
                }, {})
                data.forEach(val => {
                    //   temp = temp0[val[0]]
                    temp0[val[0]][val[1]] = val[2]
                })
                console.log("HERE", temp0);
            });
        })

}