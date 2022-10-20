// import optionsStorage from './options-storage.js';

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function get_video_duration() {
    var duration = document.querySelector('meta[name="keywords"]').content;

    var rx = /(?:(\d{1,2}):)?(\d{1,2}):(\d{2})/g;
    var arr = rx.exec(duration);

    if (arr.length > 0) {
        var durations = arr[0].split(":");

        if (durations.length == 2) {
            var total_time_sec = (parseInt(durations[0]) * 60) + parseInt(durations[1]) + randomIntFromInterval(10, 180);
        } else { return false; }

        console.log(total_time_sec);
        var date = new Date(total_time_sec * 1000);

        return date.getUTCHours().toString().padStart(2, '0') + "%3A" + date.getUTCMinutes().toString().padStart(2, '0') + "%3A" + date.getUTCSeconds().toString().padStart(2, '0') + ".00"
    } else {
        return false;
    }
}

function get_post_data() {
    duration = get_video_duration();
    var sesskey_obj = document.querySelector('input[name="sesskey"]');

    if (duration && typeof sesskey_obj != 'undefined') {
        return ("id=&sesskey=" + sesskey_obj.value + "&" + document.querySelector('a[data-scoid]').title + "&cmi__core__lesson_status=passed&cmi__core__total_time=" + duration)
            .replace("mode=", "")
            .replace("&&", "&");
    } else {
        return false
    }
}

function init() {
    // const options = await optionsStorage.getAll();

    var main_div = document.querySelector('div[class="card"]');

    main_div.innerHTML = '<button id="scormpass_skip_btn" class="button">Skip with Scormpass</button>' + main_div.innerHTML;
    document.getElementById('scormpass_skip_btn').addEventListener('click', function() {
        if (post_data = get_post_data()) {
            fetch('/mod/scorm/datamodel.php', {
                method: 'POST',
                body: get_post_data(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(
                function(_) {
                    alert("Success");
                },
                function(e) {
                    console.log("[Scormpass] " + e);
                    alert("Request Error");
                });
        } else {
            alert("General Error");
        }
    });

}

init();
