let data;

export default {
    init(config = {}) {
        Branch.setDebug(config.debug === true);
        initBranch();
        document.addEventListener('resume', initBranch, false);
    }
}

function initBranch() {
    Branch.initSession().then(handleData);
}

function handlePendingData(data) {
    return handleData(data).then(clearData);
}

function handleData(data) {

    return new Promise(async resolve => {
        if (data['+clicked_branch_link']) {
            switch (data.type || data.action) {
                case '':
                    return;
            }

        }
    });
}


function getData() {

    return data;
}

function setData(value) {

    data = value;
}

function clearData() {
    data = undefined;
}