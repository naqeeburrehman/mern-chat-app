const sendSmsFunction = (otp, phone) => {
    let message = `Your OTP code for Elaan marketing login is : ${otp} , do not share this with anyone!`;
    let isp = "telenor";
    let sql = `SELECT * FROM notification_config where isp='${isp}'`;
    let query = pool.query(sql, (err, result) => {
        let sms_config = result[0];

        let authUrl =
            "https://telenorcsms.com.pk:27677/corporate_sms2/api/auth.jsp?msisdn=923488803053&password=elaanmarketing@4321";
        let messageUrl =
            "https://telenorcsms.com.pk:27677/corporate_sms2/api/sendsms.jsp?session_id=d1fe3bc41d28454db2560f341f6982d4&to=03060595818&text=test message&mask=Elaan Mrktg";

        //------------------TELENOR COMMUNICATION---------------------
        let request_url = `https://telenorcsms.com.pk:27677/corporate_sms2/api/auth.jsp?msisdn=${sms_config.sms_no}&password=${sms_config.sms_password}`;

        //calling curl
        axios
            .get(request_url)
            .then((response) => {
                console.log(
                    "This is Success -------------------------------------------------------------------------------------------"
                );

                //xml data
                var xmldata = response.data;
                // parsing xml data
                parseString(xmldata, function (err, results) {
                    // parsing to json
                    let data = JSON.parse(JSON.stringify(results));
                    let sessionId = data.corpsms.data[0];
                    console.log(sessionId);

                    let sms_url = `https://telenorcsms.com.pk:27677/corporate_sms2/api/sendsms.jsp?session_id=${sessionId}&to=${phone}&text=${message}&mask=${sms_config.sms_masking}`;

                    axios
                        .get(sms_url)
                        .then((response) => {
                            console.log(
                                "This is Success -------------------------------------------------------------------------------------------"
                            );

                            //xml data
                            var xmldata = response.data;
                            // parsing xml data
                            parseString(xmldata, function (err, results) {
                                // parsing to json
                                let data = JSON.parse(JSON.stringify(results));
                                let sessionId = data.corpsms.data[0];
                                console.log(sessionId);
                            });
                        })
                        .catch((error) => {
                            console.log(
                                "This is Error -------------------------------------------------------------------------------------------"
                            );
                            console.log(error);
                            throw error;
                        });
                });
            })
            .catch((error) => {
                console.log(
                    "This is Error -------------------------------------------------------------------------------------------"
                );
                console.log(error);
                throw error;
            });
        // res.render("index/index.hbs");
    });
};

module.exports = { sendSmsFunction };
