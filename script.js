
let ipAddress = '';
let POArr = [];
let getBtn = document.getElementById('getdataBtn');
let dataContainer = document.getElementById('dataContainer');

async function getIP() {
    await $.getJSON("https://api.ipify.org?format=json", function (data) {

        document.getElementById('ip').innerText += data.ip
        ipAddress = data.ip;
    })
}
getIP();

function fetchIPInfo() {
    return new Promise((resolve, reject) => {
        fetch(`https://ipinfo.io/${ipAddress}?token=152a2e12ffa4eb`).then((res) => {
            return res.json();
        }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
}

getBtn.addEventListener('click', () => {
    getBtn.style.display = 'none';
    fetchIPInfo().then((res) => {
        showHeadData(res);
        showloc(res.loc);
        showMidData(res);
        fetchPostOffices(res.postal);
        console.log(res);
    })

})

function showHeadData(ipData) {
    document.getElementById('head').innerHTML += `<div>
    <div id="lat">
        Lat: ${ipData.loc.split(',')[0]}
    </div>
    <div id="long">
        Long: ${ipData.loc.split(',')[1]}
    </div>
    </div>
    <div>
    <div id="city">
        City: ${ipData.city}
    </div>
    <div id="region">
        Region: ${ipData.region}
    </div>
    </div>
    <div>
    <div id="org">
        Organisation: ${ipData.org}
    </div>
    <div id="host">
        Hostname: 
    </div>
    </div>`
}

function showloc(loc) {
    let lat = loc.split(',')[0];
    let long = loc.split(',')[1];

    document.getElementById('mapBox').innerHTML = `<iframe src="https://maps.google.com/maps?q=${lat}, ${long}&z=15&output=embed" width="100%" height="290" frameborder="0" style="border:0"></iframe>`
}

function showMidData(ipData) {
    let dateTime = new Date().toLocaleString("en-US", { timeZone: ipData.timezone });
    document.getElementById('midBox').innerHTML = `<div id="timezone">
    Time Zone: ${ipData.timezone}
    </div>
    <div id="dateTime">
    Date And Time: ${dateTime}
    </div>
    <div id="pincode">
    Pincode: ${ipData.postal}
    </div>`
}

async function fetchPostOffices(pincode) {
    let res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    let data = await res.json();
    POArr = data[0].PostOffice;

    document.getElementById('midBox').innerHTML += `<div>Message: ${data[0].Message}</div>`;

    let filter = document.getElementById('filter');
    filter.style.display = 'block';

    showPO(POArr);
}

function showPO(filteredPO) {
    filteredPO.forEach((po) => {
        document.getElementById('bottomBox').innerHTML += `<div id="poBox">
        <div>
            Name: ${po.Name}
        </div>
        <div>
            Branch Type: ${po.BranchType}
        </div>
        <div>
            Delivery Status: ${po.DeliveryStatus}
        </div>
        <div>
            District: ${po.District}
        </div>
        <div>
            Division: ${po.Division}
        </div>
        </div>`
    });
}

document.getElementById('filter').addEventListener('input', () => {
    let filteredPO = POArr.filter((ele) => {
        ele.Name.toLowerCase().includes(document.getElementById("filter").value.toLowerCase())
    });
    showPO(filteredPO);
});
