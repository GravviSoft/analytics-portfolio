require('dotenv').config()
const { CONNECTION_STRING } = process.env
const Sequelize = require('sequelize')
const sequelize = new Sequelize(CONNECTION_STRING)
const bcrypt = require('bcrypt');
const { Builder, Browser, By, until } = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
const fetch = require('node-fetch');

// const emailable = require("emailable")("live_cddbfa67eed613c34879");

const emailable = require("emailable")("test_6d6a830c441ad76f8b8b");

module.exports = {
    seed: (req, res)=>{
        sequelize.query(`
            drop table if exists notes;
            drop table if exists leads;
            drop table if exists users;

            create table users (
                user_id serial primary key, 
                first_name text, 
                last_name text, 
                password text,
                token text,
                email varchar(250) unique,
                phone text,
                industry text[],
                location text[]
                        );

            create table leads (
                lead_id serial primary key, 
                user_id integer references users(user_id),
                company text, 
                email varchar(250),
                email_verify json,
                url varchar(250),
                phone text unique,
                industry text,
                location text,
                company_img text,
                company_rating text,
                status text default 'prospect',
                status_num int default 0
                        );

            create table notes (
                notes_id serial primary key, 
                user_id integer references users(user_id),
                lead_id integer references leads(lead_id),
                title text,
                content text, 
                date text,
                like_note boolean default false
            )

        `).then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        }).catch(err => console.log('error seeding DB', err))
    }, 

    registerFunc: (req, res)=>{
        console.log(req.body)
        const { fName, lName, email, password } = req.body
        let salt = bcrypt.genSaltSync(5)
        let passHash = bcrypt.hashSync(password, salt)
        console.log(passHash)
        sequelize.query(`INSERT INTO users (first_name, last_name, email, password) VALUES('${fName}', '${lName}', '${email}', '${passHash}');`)
        .then(dbResult =>{
            console.log(dbResult)
            res.status(200).send(dbResult)
        })
        .catch(err=>{
            if (err){
                console.log(`THIS IS THE ERRROR ${err}`)
                res.status(400).send(err)
            }})

    },

    loginFunc: (req, res)=>{
        console.log(req.body)
        const { email, password } = req.body
        sequelize.query(`SELECT * FROM users WHERE email = '${email}'`)
        .then(dbResult =>{
            console.log(dbResult)

            if (dbResult[0].length === 0){
                console.log('Need to register.')
                res.status(400).send({"error": 'Need to register.'})
            } else {
            let dbPassword = dbResult[0][0].password
            let existingPass = bcrypt.compareSync(password, dbPassword)
            if (existingPass){  
                let userInfo =  dbResult[0]
                const userCopyNoPass = [...userInfo]
                delete userCopyNoPass[0].password
                console.log(userCopyNoPass[0])
                res.status(200).send({"userInfo": userCopyNoPass[0]})
            } else {
                res.status(400).send({"error": "Incorrect Password"})
            }}
            })
        .catch(err=>console.log(`THIS IS THE ERRROR ${err}`))

        }, 
    selectLeadsFunc: (req, res)=>{
            console.log(req.body, req.params)
            const { industry, location, cookie } = req.body
            let cookieGrab = cookie.split(";")[0]
            console.log(cookieGrab)
            sequelize.query(`UPDATE users SET industry = '{${industry}}', location = '{${location}}'  WHERE user_id = '${cookieGrab}'`)
            .then(dbResult =>{
                    console.log(dbResult)
                    res.status(200).send({user_id: cookieGrab})
            })
            .catch(err=>{
                if (err){
                    console.log(`THIS IS THE ERRROR ${err}`)  
                    res.status(400).send(err)
            }
            })
    },

    scrapeGoogleFunc:  (req, res)=>{
            const { user_id } = req.params
            const { headlessBrowser } = req.body
            console.log(headlessBrowser, user_id)
            sequelize.query(`SELECT * FROM users WHERE user_id = '${user_id}'`)
            .then(dbResult =>{

                console.log(dbResult[0])
                // creating urls that look like this:  'https://www.google.com/search?q=roofing  companies near alabama'
                const googleQueryUrls = []

                const userIndustry = dbResult[0][0].industry
                const userLocation = dbResult[0][0].location

                for (i=0; i<userLocation.length; i++){
                    for (j=0; j<userIndustry.length; j++){
                        const googleQ = `https://www.google.com/search?q=${userIndustry[j]} companies near ${userLocation[i]}`
                        googleQueryUrls.push(googleQ)   
                    }
                }
                console.log(googleQueryUrls) 

                let driver;

                async function scrapeGoogle (){
                
                    let count = googleQueryUrls.length

                    while  (count > 0) {
                        for (site=0; site<googleQueryUrls.length; site++){
                            count -= 1

                            headlessBrowser ?  driver = new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build() : driver = await new Builder().forBrowser(Browser.CHROME).build();

                            // await driver.get(googleQueryUrls[site])
                            await driver.get(`${googleQueryUrls[site]}`)
                            const busButton = await driver.findElement(By.xpath("//span[text()='More businesses']")).catch(err=>{console.log(err);});   
                            const busButtonText = await driver.findElement(By.xpath("//span[text()='More businesses']")).getText().catch(err=>{console.log(err);});      
                            const busButtonTextArray = [busButtonText] 
                            console.log(busButtonText, busButtonTextArray)
                            if (busButtonText != undefined){
                                await driver.wait(until.elementIsVisible(busButton), 1000).catch(err=>{console.log(err);});
                                await driver.sleep(10000);
                                await busButton.click().catch(err=>{console.log(err);});
                                await driver.sleep(10000);

                                const baseGoogleXpath = '/html/body/c-wiz/div/div[3]/div/div/div[1]/div[3]/div[3]/c-wiz/div/div/div[1]/c-wiz[2]/div'

                                const baseGoogleXpath2 = '/html/body/c-wiz/div/div[3]/div/div/div[1]/div[3]/div[3]/c-wiz/div/div/div[1]/c-wiz/div'  

                                const num = 40
                                for (i=0; i<num; i++){
                                    if (i%2 != 0){
                                        // End of Xpath
                                        const titlesXpath  = `/div[${i}]/div[1]/div/div/div/div[2]/div[1]/div`
                                        const industrysXpath  = `/div[${i}]/div[1]/div/div/div/div[2]/div[2]/span`
                                        const locationsXpath  = `/div[${i}]/div[1]/div/div/div/div[2]/div[3]/span[2]/span`
                                        const imgsXpath  = `/div[${i}]/div[1]/div/div/div/div[1]/img`
                                        const phonesXpath  = `/div[${i}]/div[1]/div/div/div/div[2]/div[3]/span[3]`
                                        const websitesXpath  = `/div[${i}]/div[2]/div/div/div/div/div/div[1]/a`

                                        const phoneTest = await driver.findElement(By.xpath(`${baseGoogleXpath}${phonesXpath}`)).getText().catch(err =>console.log(err));
                                        if (phoneTest === undefined) {
                                            const titlesXpath  = `/div[${i}]/div[1]/div/div/div/div[2]/div[1]/div`
                                            const industrysXpath  = `/div[${i}]/div[1]/div/div/div/div[2]/div[2]/span`
                                            const locationsXpath  = `/div[${i}]/div[1]/div/div/div/div[2]/div[3]/span[2]/span`
                                            const imgsXpath  = `/div[${i}]/div[1]/div/div/div/div[1]/img`
                                            const phonesXpath  = `/div[${i}]/div[1]/div/div/div/div[2]/div[3]/span[3]`
                                            const websitesXpath  = `/div[${i}]/div[2]/div/div/div/div/div/div[1]/a`
                                            const company = await driver.findElement(By.xpath(`${baseGoogleXpath2}${titlesXpath}`)).getText().catch(err =>console.log(err))

                                            const industry = await driver.findElement(By.xpath(`${baseGoogleXpath2}${industrysXpath}`)).getText().catch(err =>console.log(err))
                                            // console.log(company, industry);

                                            const location = await driver.findElement(By.xpath(`${baseGoogleXpath2}${locationsXpath}`)).getText().catch(err =>{
                                                if (err){
                                                    console.log(err)
                                                }
                                            });
                                            const company_img = await driver.findElement(By.xpath(`${baseGoogleXpath2}${imgsXpath}`)).getAttribute("src").catch(err =>console.log(err));
                                            const phone = await driver.findElement(By.xpath(`${baseGoogleXpath2}${phonesXpath}`)).getText().catch(err =>console.log(err));
                                            // const url = await driver.findElement(By.xpath(`${baseGoogleXpath2}${websitesXpath}`)).getAttribute("href").catch(err =>console.log(err));
                                            let url = await driver.findElement(By.xpath(`${baseGoogleXpath2}${websitesXpath}`)).getAttribute("href").catch(err =>console.log(err));
                                            console.log(company, industry, location, company_img, phone, url);
                                            
                                            console.log(`This is url before:  ${url}`)
                                            
                                            if (url === undefined){
                                                url = ""
                                            }
                                            console.log(`This is url after:  ${url}`)
                                            sequelize.query(`INSERT INTO leads (user_id, company, industry, location, company_img, phone, email, url) VALUES('${user_id}', '${company}', '${industry}', '${location}', '${company_img}', '${phone}', '', '${url}');
                                                    `)
                                            .then(dataResults =>{
                                                console.log(dataResults)
                                            })
                                            .catch(error =>{
                                                console.log(error)
                                            })
                                            
                                            await driver.sleep(2000);
                                        } else {
                                            const company = await driver.findElement(By.xpath(`${baseGoogleXpath}${titlesXpath}`)).getText().catch(err =>console.log(err))


                                            const industry = await driver.findElement(By.xpath(`${baseGoogleXpath}${industrysXpath}`)).getText().catch(err =>console.log(err))
                                            // console.log(company, industry);

                                            const location = await driver.findElement(By.xpath(`${baseGoogleXpath}${locationsXpath}`)).getText().catch(err =>{
                                                if (err){
                                                    console.log(err)
                                                }
                                            });
                                            const company_img = await driver.findElement(By.xpath(`${baseGoogleXpath}${imgsXpath}`)).getAttribute("src").catch(err =>console.log(err));
                                            const phone = await driver.findElement(By.xpath(`${baseGoogleXpath}${phonesXpath}`)).getText().catch(err =>console.log(err));
                                            // const url = await driver.findElement(By.xpath(`${baseGoogleXpath}${websitesXpath}`)).getAttribute("href").catch(err =>console.log(err));
                                            let url = await driver.findElement(By.xpath(`${baseGoogleXpath}${websitesXpath}`)).getAttribute("href").catch(err =>console.log(err));
                                            console.log(company, industry, location, company_img, phone, url);
                                            
                                            console.log(`This is url before:  ${url}`)
                                            
                                            if (url === undefined){
                                                url = ""
                                            }
                                            console.log(`This is url after:  ${url}`)

                                            sequelize.query(`INSERT INTO leads (user_id, company, industry, location, company_img, phone, email, url) VALUES('${user_id}', '${company}', '${industry}', '${location}', '${company_img}', '${phone}', '', '${url}');`)
                                            .then(dataResults =>{
                                                console.log(dataResults)
                                            })
                                            .catch(error =>{
                                                console.log(error)
                                            })
                                            
                                            await driver.sleep(2000);
                                            }
                                        }
                                    } 
                                    
                                    await driver.quit();

                                    console.log(`Finished Scraping Iteration ${count}`)
                                
                                } else {
                                    await driver.quit();
                                    console.log('Finished Scraping Go Refresh Dashboard')
                                }
                        }
                    }
                
                res.status(200).send({msg: 'Finished Pulling Leads.'})

                }

                scrapeGoogle()

                })
            .catch(err => {
                console.log(err)
                res.status(400).send({msg: err})
            })
        },

        scrapeYPFunc: (req, res)=>{
            const { user_id } = req.params
            const { headlessBrowser } = req.body
            console.log(headlessBrowser, user_id)
            sequelize.query(`SELECT * FROM users WHERE user_id = '${user_id}'`)
            .then(dbResult =>{

                console.log(dbResult[0])
                // creating urls that look like this:  'https://www.google.com/search?q=google+utah+roofing'
                    
                const yellowPgUrls = []

                const userIndustry = dbResult[0][0].industry
                const userLocation = dbResult[0][0].location

                for (i=0; i<userLocation.length;i++){
                    for (j=0; j<userIndustry.length; j++){ 
                        const ypQuery = `https://www.yellowpages.com/search?search_terms=${userIndustry[j]}&geo_location_terms=${userLocation[i]}`
                        yellowPgUrls.push(ypQuery)
                    }
                }
                console.log(yellowPgUrls)

                let driver;

                async function scrapeYP(){

                    let count = yellowPgUrls.length

                    while  (count > 0) {
                    
                        for (site=0; site<yellowPgUrls.length; site++){
                            count -= 1


                            // driver = await new Builder().forBrowser(Browser.CHROME).build();
                         
                            headlessBrowser ?  driver = new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build() : driver = await new Builder().forBrowser(Browser.CHROME).build();

                            await driver.get(`${yellowPgUrls[site]}`)
                            
                            const ypXathBase = '/html/body/div/div[2]/div[1]/div[1]/div[4]/div[2]'

                            const ypXathBase2 = '/html/body/div/div[2]/div[1]/div[1]/div[3]/div[2]'

                            const num = 30
                            for (i=0; i<num; i++){

                                // End of Xpath
                                const titlesXpath  = `/div[${i}]/div/div/div[2]/div[1]/h2/a`
                                const industrysXpath  = `/div[${i}]/div/div/div[2]/div[1]/div[1]/a[1]`
                                const locationsXpath  = `/div[${i}]/div/div/div[2]/div[2]/div[2]/div[2]`
                                const imgsXpath  = `/div[${i}]/div/div/div[1]/a/img`
                                const phonesXpath  = `/div[${i}]/div/div/div[2]/div[2]/div[1]`
                                const websitesXpath  = `/div[${i}]/div/div/div[2]/div[1]/div[3]/a[1]`


                                let titleTest = await driver.findElement(By.xpath(`${ypXathBase}${titlesXpath}`)).getText().catch(err =>console.log(err))

                                if (titleTest === undefined){
                                    const company = await driver.findElement(By.xpath(`${ypXathBase2}${titlesXpath}`)).getText().catch(err =>console.log(err))

                                    const industry = await driver.findElement(By.xpath(`${ypXathBase2}${industrysXpath}`)).getText().catch(err =>console.log(err))
                                    // console.log(company, industry);
                                    
                                    const location1 = await driver.findElement(By.xpath(`${ypXathBase2}${locationsXpath}`)).getText().catch(err =>console.log(err))

                                    const company_img = await driver.findElement(By.xpath(`${ypXathBase2}${imgsXpath}`)).getAttribute("src").catch(err =>console.log(err));
                                    const phone = await driver.findElement(By.xpath(`${ypXathBase2}${phonesXpath}`)).getText().catch(err =>console.log(err));
                                    let url = await driver.findElement(By.xpath(`${ypXathBase2}${websitesXpath}`)).getAttribute("href").catch(err =>console.log(err));
                                    if (url === undefined){
                                        url = ""
                                    }
                                    
                                    if (location1){
                                        const location = location1.substring(0, location1.length - 6)
                                        console.log(company, industry, location, company_img, phone, url);
                                        sequelize.query(`INSERT INTO leads (user_id, company, industry, location, company_img, phone, email, url) VALUES('${user_id}', '${company}', '${industry}', '${location}', '${company_img}', '${phone}', '', '${url}');
                                            `)
                                        
                                        .then(dataResults =>{
                                            console.log(dataResults)
                                        })
                                        .catch(error =>{
                                            console.log(error)
                                        })     
                                    }   
                                    await driver.sleep(2000);   
                                    
                                } else {

                                    const company = await driver.findElement(By.xpath(`${ypXathBase}${titlesXpath}`)).getText().catch(err =>console.log(err))

                                    const industry = await driver.findElement(By.xpath(`${ypXathBase}${industrysXpath}`)).getText().catch(err =>console.log(err))
                                    // console.log(company, industry);
                                    
                                    const location1 = await driver.findElement(By.xpath(`${ypXathBase}${locationsXpath}`)).getText().catch(err =>console.log(err))

                                    const company_img = await driver.findElement(By.xpath(`${ypXathBase}${imgsXpath}`)).getAttribute("src").catch(err =>console.log(err));
                                    const phone = await driver.findElement(By.xpath(`${ypXathBase}${phonesXpath}`)).getText().catch(err =>console.log(err));
                                    let url = await driver.findElement(By.xpath(`${ypXathBase}${websitesXpath}`)).getAttribute("href").catch(err =>console.log(err));
                                    if (url === undefined){
                                        url = ""
                                    }
                                    
                                    if (location1){
                                        const location = location1.substring(0, location1.length - 6)
                                        console.log(company, industry, location, company_img, phone, url);
                                        sequelize.query(`INSERT INTO leads (user_id, company, industry, location, company_img, phone, email, url) VALUES('${user_id}', '${company}', '${industry}', '${location}', '${company_img}', '${phone}', '', '${url}');
                                            `)
                                    
                                    .then(dataResults =>{
                                        console.log(dataResults)
                                    })
                                    .catch(error =>{
                                        console.log(error)
                                    })     
                                    }   
                                    await driver.sleep(2000);   
                                    } 

                                }
                            await driver.quit();
                            console.log(`Finished Scraping Iteration ${count}`)
                        }

                    }

                res.status(200).send({msg: 'Finished Pulling Leads.'})

                }

                scrapeYP()

                })
            .catch(err => res.status(400).send(err))
        },

        getDashboard: (req, res)=>{
            console.log(req.body, req.params)
            let { user_id } = req.params
        
            console.log(user_id)

            sequelize.query(`SELECT * FROM users WHERE user_id = '${user_id}'`)
            .then(dbResult =>{
                console.log("dbResult[0][0]", dbResult[0][0])
                const userLocation = dbResult[0][0].location
                const userIndustry = dbResult[0][0].industry

                const newLoc = userLocation.join("%|%")
                const newInd = userIndustry.join("%|%")

                sequelize.query(`SELECT * FROM leads WHERE location SIMILAR TO '%${newLoc}%' AND industry SIMILAR TO '%${newInd}%' OR leads.user_id = '${user_id}'`)
                
                .then(leadsResults =>{
                    sequelize.query(`SELECT industry, COUNT (*) AS industry_count FROM leads WHERE user_id = '${user_id}' GROUP BY industry`)
                    .then(pieChartData=>{
                        let industryName = []
                        let industryNum = []
                        let backgroundColor = []
                        let hoverBackgroundColor = []

                        let f = Math.round, r= Math.random, n= 255;

                        pieChartData[0].map(item => {
                            industryName.push(item.industry)
                            industryNum.push(+item.industry_count)
                            let rgba = `${f(r()*n)}, ${f(r()*n)}, ${f(r()*n)}`
                            backgroundColor.push(`rgba(${rgba}, 0.2)`)
                            hoverBackgroundColor.push(`rgb(${rgba})`)
                        })
                        sequelize.query(`SELECT location, COUNT (*) AS location_count FROM leads WHERE user_id = '${user_id}' GROUP BY location`)
                        .then(pieChartData2=>{
                            let locationName = []
                            let locationNum = []
                            let locationbackgroundColor = []
                            let locationhoverBackgroundColor = []
                            let f = Math.round, r= Math.random, n= 255;

                            pieChartData2[0].map(item => {
                                locationName.push(item.location)
                                locationNum.push(+item.location_count)
                                let rgba = `${f(r()*n)}, ${f(r()*n)}, ${f(r()*n)}`
                                locationbackgroundColor.push(`rgba(${rgba}, 0.2)`)
                                locationhoverBackgroundColor.push(`rgb(${rgba})`)
                            })
   
                            sequelize.query(`SELECT status, COUNT (*) AS status_count FROM leads WHERE user_id = '${user_id}' GROUP BY status`)
                            .then(pieChartData3=>{
                                let statusName = []
                                let statusNum = []
                                let statusbackgroundColor = []
                                let statushoverBackgroundColor = []

                                pieChartData3[0].map(item => {
                                    statusName.push(item.status)
                                    statusNum.push(+item.status_count)
                                    const getStatusGraphBackGroundColor = (status) =>{
                                        switch (status){
                                            case 'dnc':
                                                return '244, 230, 24';
                                            case 'unqualified':
                                                return '47, 75, 54';
                                            case 'new client':
                                                return '19, 227, 183';
                                            case 'prospect':
                                                return '11, 98, 252';
                                            case 'meeting':
                                                return '249, 115, 21';
                                            case 'negotiation':
                                                return '217, 79, 133';
                                            }
                                    }
                                    statusbackgroundColor.push(`rgba(${getStatusGraphBackGroundColor(item.status)}, 0.2)`)
                                    statushoverBackgroundColor.push(`rgb(${getStatusGraphBackGroundColor(item.status)})`)
                                })                                
                                res.status(200).send({userInfo: dbResult[0][0], leadInfo: leadsResults[0], industryName: industryName, industryNum: industryNum, backgroundColor: backgroundColor, hoverBackgroundColor: hoverBackgroundColor, locationName: locationName, locationNum: locationNum, locationbackgroundColor: locationbackgroundColor, locationhoverBackgroundColor: locationhoverBackgroundColor, statusName:  statusName, statusNum: statusNum, statusbackgroundColor:  statusbackgroundColor, statushoverBackgroundColor: statushoverBackgroundColor})
                            })
                            .catch(err=>res.status(400).send(err))
                        })
                        .catch(err=>res.status(400).send(err))
                    })
                    .catch(err=>res.status(400).send(err))
                })
                .catch(err=>{res.status(400).send(err)})    
            })
            .catch(err=>{res.status(400).send(err)})  
        },

        patchDashboard:  (req, res)=>{
            console.log(req.params, req.body)
            const { lead_id } = req.params
            const { user_id, company, industry, location, phone, email, url, status, status_num } = req.body
            sequelize.query(`UPDATE leads SET company = '${company}', industry = '${industry}', location = '${location}', phone = '${phone}', email = '${email}', url = '${url}', status = '${status}', status_num = '${status_num}'  WHERE lead_id = ${lead_id}`)
            .then(dataResults =>{
                console.log(dataResults)
                res.status(200).send({msg: "Successfully updated lead!"})
            })
            .catch(err=>{
                console.log(`ERRRRROR: ${err}`)
                 res.status(400).send(err)
            }) 
        },

        postDashboard:  (req, res)=>{
            console.log(req.body)
            const { user_id } = req.params
            const { company, industry, location, email, url, phone, status, status_num } = req.body
            const company_img = 'https://i1.ypcdn.com/ypu/images/default-thumbnails/thumbnail-4.svg?951f1b9'
            sequelize.query(`INSERT INTO leads (user_id, company, industry, location, company_img, phone, url, email, status, status_num) VALUES('${user_id}', '${company}', '${industry}', '${location.toUpperCase()}', '${company_img}', '${phone}', '${url}', '${email}', '${status}', '${status_num}')`)
            .then(dataResults =>{
                console.log(dataResults)
                res.status(200).send({msg: "Successfully saved new lead!"})
            })
            .catch(err=>{
                console.log(`ERRRRROR: ${err}`)
                 res.status(400).send(err)
            }) 
        },


        deleteDashboard: (req, res)=>{
            console.log(req.body, req.params, req.query)
            const { lead_id } = req.params
            console.log(lead_id)
            sequelize.query(`DELETE FROM notes WHERE lead_id IN (${lead_id.split(",")})`)
            .then(dataResults =>{
                sequelize.query(`DELETE FROM leads WHERE lead_id IN (${lead_id.split(",")})`)
                .then(dataResults2 =>{
                    console.log(dataResults2)
                    res.status(200).send({msg: "Successfully deleted!"})
                })
                .catch(err=>{
                    console.log(`ERRRRROR: ${err}`)
                    res.status(400).send(err)
                }) 
            })
            .catch(err=>{
                console.log(`ERRRRROR: ${err}`)
                res.status(400).send(err)
            }) 
        },
        
        emailPull: (req, res)=>{
            const { user_id } = req.params
            const { headlessBrowser } = req.body
            console.log(headlessBrowser, user_id)

            sequelize.query(`SELECT * FROM users WHERE user_id = '${user_id}'`)
            .then(dbResult =>{

                console.log(dbResult[0])
                const userLocation = dbResult[0][0].location
                const userIndustry  =  dbResult[0][0].industry

                const newLoc = userLocation.join("%|%")
                const newInd = userIndustry.join("%|%")

                sequelize.query(`SELECT * FROM leads WHERE location SIMILAR TO '%${newLoc}%' AND industry SIMILAR TO '%${newInd}%' OR user_id = '${user_id}'`)
                .then(leadsResults =>{

                    async function getEmails() {

                        let driver;
                        let leadNum = leadsResults[0].length
                        while  (leadNum > 0) {
                            for (i=0; i<leadsResults[0].length; i++){
                                leadNum -= 1
                                if (leadsResults[0][i].url.includes('http') && leadsResults[0][i].email === ""  ){
                                    
                                    console.log(leadsResults[0][i].url)

                                    headlessBrowser ?  driver = new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build() : driver = await new Builder().forBrowser(Browser.CHROME).build();

                                    // let driver = new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build();
        
                                    await driver.get(`${leadsResults[0][i].url}`).catch(err=> console.log(err))

                                    const string_context = await driver.findElement(By.xpath(`//body`)).getText().catch(err =>console.log(err))
                                    
                                    if (string_context != undefined){
                                        let array_mails = string_context.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
                                        console.log(array_mails)

                                        if (array_mails){
                                            sequelize.query(`UPDATE leads SET email = '${array_mails[0].toLowerCase()}'  WHERE lead_id = '${leadsResults[0][i].lead_id}'`)
                                            .then(dbResult =>{
                                                console.log(dbResult)
                                            })
                                            .catch(err => console.log(err))
                                        }
                                    }
                                    await driver.quit();
                                }
                                console.log(`Url count:  ${leadNum}`)
                            }
                        }
                        res.status(200).send({msg: 'Finished Pulling Emails.'})
                    }

                    getEmails()
                })
                .catch(err=>{
                    console.log(err)
                    res.status(400).send(err)
                })
                
            })
            .catch(err => {
                console.log(err)
            })
        },



        emailVerify: (req, res)=>{
            const { user_id } = req.params
            const { headlessBrowser } = req.body
            console.log(headlessBrowser, user_id)
            sequelize.query(`SELECT * FROM leads WHERE (email = '') IS NOT true AND email_verify IS NULL AND user_id = '${user_id}'`)
            .then(dbResult =>{
                console.log(dbResult[0])
                dbResult[0].map(items =>{
                    const { email, email_verify, lead_id } = items
                    console.log(email, lead_id)
                    
                    // API EMAIL VERIFICATION
                    const url = `https://disposable.debounce.io/?${email}`;
                    const options = {method: 'GET', headers: {accept: 'application/json'}};

                    fetch(url, options)
                    .then(res => res.json())
                    .then(json => {
                        sequelize.query(`UPDATE leads SET email_verify = '${JSON.stringify(json)}'  WHERE lead_id = '${lead_id}'`)
                        .then(dbResult =>{
                            console.log(dbResult)
                        })
                        .catch(err => console.log(err))
                    })
                    .catch(err => console.error('error:' + err));

                    // API EMAIL VERIFICATION
                    // https://emailable.com/docs/api/#authentication
                    // function verifyTheEmail(db_email, db_lead_id){
                    //     emailable.verify(db_email)
                    //     .then(function (response) {
                    //         // asynchronously called
                    //         console.log(JSON.stringify(response))
                            
                    //         sequelize.query(`UPDATE leads SET email_verify = '${JSON.stringify(response)}'  WHERE lead_id = '${db_lead_id}'`)
                    //         .then(dbResult =>{
                    //             console.log(dbResult)
                    //         })
                    //         .catch(err => console.log(err))
                    //     })
                    //     .catch(err => console.log(err))
                    // }

                    // verifyTheEmail(db_email=email, db_lead_id=lead_id)

                })
                res.status(200).send({msg: 'Finished Pulling Emails.'})
                
                
            })
            .catch(err => {
                console.log(err)
            })
        },


        postLead: (req, res)=>{
            const { lead_id  } = req.params
            const { user_id, title, content, date } = req.body
            console.log(lead_id, req.body)
            // SAVE LEAD
            sequelize.query(`INSERT INTO notes (user_id, lead_id, title, content, date) VALUES('${user_id}', '${lead_id}', '${title}', '${content}', '${date}')`)
            .then(dataResults =>{
                console.log(dataResults)

                //GET ARRAY OF NOTES TO RETURN
                sequelize.query(`SELECT * FROM notes WHERE lead_id = ${lead_id} AND user_id = ${user_id} ORDER BY notes_id ASC`)
                .then(dataResults2 =>{
                    console.log(dataResults2[0])
                    res.status(200).send(dataResults2[0])
                })
                .catch(err=>{
                    console.log(`ERRRRROR: ${err}`)
                    res.status(400).send(err)
                })    
            })
            .catch(err=>{
                console.log(`ERRRRROR: ${err}`)
                res.status(400).send(err)
            }) 
        },


        getLead: (req, res)=>{
            const { lead_id } = req.params
            console.log(lead_id)
            sequelize.query(`SELECT * FROM leads WHERE lead_id = ${lead_id} `)
            .then(results=>res.status(200).send(results[0][0]))
            .catch(err=>{
                console.log(`ERRRRROR: ${err}`)
                 res.status(400).send(err)
            }) 
        },

        patchLead:  (req, res)=>{
            console.log(req.params, req.body)
            const { lead_id } = req.params
            const { status, status_num } = req.body
            console.log(status, status_num, lead_id)
            sequelize.query(`UPDATE leads SET status = '${status}', status_num = '${status_num}'  WHERE lead_id = ${lead_id}`)
            .then(dataResults =>{
                sequelize.query(`SELECT * FROM leads WHERE lead_id = ${lead_id} `)
                .then(results=>res.status(200).send(results[0][0]))
                .catch(err=>{
                    console.log(`ERRRRROR: ${err}`)
                    res.status(400).send(err)
                }) 
            })
            .catch(err=>{
                console.log(`ERRRRROR: ${err}`)
                 res.status(400).send(err)
            }) 
        },

        deleteLead: (req, res)=>{
            const { notes_id, lead_id, user_id  } = req.params
            console.log("notes_id", notes_id, lead_id, user_id)
            sequelize.query(`DELETE FROM notes WHERE notes_id = '${notes_id}'`)
            .then(dataResults =>{
                console.log(dataResults)
                //GET ARRAY OF NOTES TO RETURN
                sequelize.query(`SELECT * FROM notes WHERE lead_id = ${lead_id} AND user_id = ${user_id} ORDER BY notes_id ASC`)
                .then(dataResults =>{
                    console.log(dataResults[0])
                    res.status(200).send(dataResults[0])
                })
                .catch(err=>{
                    console.log(`ERRRRROR: ${err}`)
                    res.status(400).send(err)
                })    
            })
            .catch(err=>{
                console.log(`ERRRRROR: ${err}`)
                res.status(400).send(err)
            }) 
        },


        getLeadNote: (req, res)=>{
            const { lead_id  } = req.params
            const { user_id } = req.body
            console.log("getLeadNote", lead_id, req.body)
            sequelize.query(`SELECT * FROM notes WHERE lead_id = ${lead_id} AND user_id = ${user_id} ORDER BY notes_id ASC`)
            .then(dataResults =>{
                console.log(dataResults[0])
                res.status(200).send(dataResults[0])
            })
            .catch(err=>{
                console.log(`ERRRRROR: ${err}`)
                res.status(400).send(err)
            }) 

        }, 

        patchNote: (req, res)=>{
            const { notes_id, lead_id, user_id  } = req.params
            const {like_note} = req.body
            console.log("notes_id", notes_id, lead_id, user_id, "like_note", like_note)
            sequelize.query(`UPDATE notes SET like_note = ${like_note} WHERE notes_id = '${notes_id}'`)
            .then(dataResults =>{
                console.log(dataResults)
                //GET ARRAY OF NOTES TO RETURN
                sequelize.query(`SELECT * FROM notes WHERE lead_id = ${lead_id} AND user_id = ${user_id} ORDER BY notes_id ASC`)
                .then(dataResults2 =>{
                    console.log(dataResults2[0])
                    res.status(200).send(dataResults2[0])
                })
                .catch(err=>{
                    console.log(`ERRRRROR: ${err}`)
                    res.status(400).send(err)
                })    
            })
            .catch(err=>{
                console.log(`ERRRRROR: ${err}`)
                res.status(400).send(err)
            })     
        }, 
}
