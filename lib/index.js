// VIES-VAT - bitinix@gmail.com

const https = require('https')

const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'EL', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'XI']

module.exports = async function (json, callback) {
    var res = await build(json)
    if (typeof callback === 'function') {
        callback(res.error, res.viesInfo)
    } else {
        return res
    }
}

async function build(json) {
    return new Promise(async (resolve) => {
        if (!json) {
            resolve({ error: 'vies Badly formed request - Check vatNumber & countryCode', viesInfo: false })
            return
        }

        if (!json.vatNumber ||
            !json.countryCode) {
            resolve({ error: 'vies Badly formed request - Check vatNumber & countryCode', viesInfo: false })
            return
        }

        if (json.vatNumber.length == 0) {
            resolve({ error: 'vies Badly formed request - vatNumber is empty', viesInfo: false })
            return
        }

        if (json.countryCode.length == 0) {
            resolve({ error: 'vies Badly formed request - countryCode is empty ', viesInfo: false })
            return
        }

        if (!euCountries.includes(json.countryCode)) {
            resolve({ error: 'vies Badly formed request - Not EU Country', viesInfo: false })
            return
        }

        var timeout = 30000
        if (json.timeout) {
            timeout = json.timeout
        }


        var call = {}
        call.xml = `
            <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                xmlns:tns1="urn:ec.europa.eu:taxud:vies:services:checkVat:types"
                xmlns:impl="urn:ec.europa.eu:taxud:vies:services:checkVat">
                <soap:Header>
                </soap:Header>
                <soap:Body>
                    <tns1:checkVat xmlns:tns1="urn:ec.europa.eu:taxud:vies:services:checkVat:types"
                    xmlns="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
                    <tns1:countryCode>${json.countryCode}</tns1:countryCode>
                    <tns1:vatNumber>${json.vatNumber}</tns1:vatNumber>
                    </tns1:checkVat>
                </soap:Body>
            </soap:Envelope>`

        call.options = {
            hostname: 'ec.europa.eu',
            path: '/taxation_customs/vies/services/checkVatService',
            port: 443,
            method: 'POST',
            timeout: timeout,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8',
                'Accept-Encoding': 'none',
                'User-Agent': 'VIES-VAT',
                'Accept-Charset': 'utf-8',
                'Content-Length': call.xml.length,
                'Connection': 'close'
            }
        };

        if (json.debug) call.debug = true

        if (json.debug) console.log('vies debug - Request to VIES Starting')

        const response = await euCall(call)

        if (json.debug) console.log('vies debug - Request to VIES Completed')

        var output = {
            valid: false,
            countryCode: json.countryCode,
            vatNumber: json.vatNumber,
            requestDate: await tag(response.body, 'requestDate'),
            name: false,
            address: false
        }

        if (response.error) {
            output.error = 'vies call error - check common issues'
            resolve({ error: output.error, viesInfo: output })
            return
        }

        if (!response.body) {
            output.error = 'vies call error - check common issues'
            resolve({ error: output.error, viesInfo: output })
            return
        }

        if (!response.body.includes('<valid>true</valid>')) {
            if (call.debug) console.error(`vies debug - Error 2019 - ${error} `)
            resolve({ error: false, viesInfo: output })
            return
        }

        output = {
            valid: true,
            countryCode: await tag(response.body, 'countryCode'),
            vatNumber: await tag(response.body, 'vatNumber'),
            requestDate: await tag(response.body, 'requestDate'),
            name: await tag(response.body, 'name'),
            address: await tag(response.body, 'address'),
        }

        resolve({ error: false, viesInfo: output })
        return
    })
}

async function tag(str, tag) {
    return new Promise((resolve) => {
        try {
            let fnd = new RegExp(`<${tag}>(.*?)<\/${tag}>`, 'ig')
            let rpl = new RegExp(`<\/?${tag}>`, 'ig')
            str.match(fnd).map(function (val) {
                var selected = val.replace(rpl, '');
                resolve(selected)
            });
        } catch (e) {
            resolve(false)
        }
    });
}

// to come - parse call errors
async function parseErrors(str) {
    return new Promise((resolve) => {
        var message = 'error'
        resolve(str)
    })

}

async function euCall(call) {
    return new Promise((resolve) => {
        try {
            const req = https.request(call.options, res => {
                res.setEncoding('utf8');
                var body = '';
                res.on('data', function (chunk) {
                    body += chunk;
                });

                res.on('end', function () {
                    body = JSON.stringify(body)
                    if (res.statusCode != 200) {
                        if (call.debug) console.log(`vies debug - status:${res.statusCode} ${body} `)
                        resolve({ 'error': true, 'message': 'vies Error in call to EU', 'status': res.statusCode, body: false })
                    } else {
                        if (call.debug) console.log(`vies debug - status:${res.statusCode} Successful call `)
                        resolve({ 'error': false, 'message': 'vies Successful Call to EU', 'status': res.statusCode, body: body })
                    }
                });
            })

            req.on('error', error => {
                if (call.debug) console.error(`vies debug - Error 2020 - ${error} `)
                resolve({ 'error': true, message: 'vies call error - check common issues' })
                req.abort();
            })

            req.on('timeout', () => {
                if (call.debug) console.error(`vies debug - Error 2021 - Timeout`)
                resolve({ 'error': true, message: 'VIES-VAT Timeout - check common issues' })
                req.abort();
            });

            req.write(call.xml)
            req.end()
        } catch (error) {
            if (call.debug) console.error(`vies debug - Catch Error 2023 - ${error} `)
            resolve({ 'error': true, message: 'vies call error - check common issues' })
            req.abort();
        }
    })
}
