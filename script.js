document.addEventListener("DOMContentLoaded", function(){
    const searchbutton = document.getElementById("search-btn");
    const usernameinput = document.getElementById("user-input");
    const statscontainer = document.querySelector(".stats-container");
    const easyprogresscircle = document.querySelector(".easy-progress");
    const mediumprogresscircle = document.querySelector(".medium-progress");
    const hardprogresscircle = document.querySelector(".hard-progress");
    const easylabel = document.getElementById("easy-label");
    const mediumlabel = document.getElementById("medium-label");
    const hardlabel = document.getElementById("hard-label");
    const cardstatscontainer = document.querySelector(".stats-card");


    function validateusername(username){
        if(username.trim() ===""){
            alert("UserName should not be empty !!!");
            return false;
        }
        // const regex=/^[a-zA-Z0-9_-]{1,15}$/;
        const regex=/[a-zA-Z0-9,\.\_]/;
        const ismatching=regex.test(username);
        if(!ismatching){
            alert("Invalid Username.")
        }
        return ismatching;
    }

    async function fetchuserdetails(username) 
    {
        // const url= `https://leetcode-stats-api.herokuapp.com/${username}`;
        try
        {
            searchbutton.textContent="Searching...";
            searchbutton.disabled= true;

            // const response= await fetch(url);
            const proxyurl=`https://cors-anywhere.herokuapp.com/`
            const targetUrl=`https://leetcode.com/graphql/`;
            const myHeaders = new Headers();
            myHeaders.append("content-type" , "application/json");
    
            const graphql = JSON.stringify({
                query: "\n    query userProfileUserQuestionProgressV2($userSlug: String!) {\n  userProfileUserQuestionProgressV2(userSlug: $userSlug) {\n    numAcceptedQuestions {\n      count\n      difficulty\n    }\n    numFailedQuestions {\n      count\n      difficulty\n    }\n    numUntouchedQuestions {\n      count\n      difficulty\n    }\n    userSessionBeatsPercentage {\n      difficulty\n      percentage\n    }\n    totalQuestionBeatsPercentage\n  }\n}\n    ",
                variables: {userSlug: `${username}`}
            })
            const requestOptions={
                method: "POST",
                headers: myHeaders,
                body: graphql,
                redirect: "follow"
            };
            const response = await fetch(proxyurl+targetUrl, requestOptions);

            if(!response.ok){
                throw new Error("Unable to fetch the User details.");
            }
            const parseddata= await response.json();
            console.log("Logging data: ",parseddata);

            displayuserdata(parseddata);
        }
        catch(error)
        {
            statscontainer.innerHTML=`<p>No data Found</p>`
            // <p>No data Found</p>
            // <p>${error.message}</p>
        }
        finally
        {
            searchbutton.textContent="Search";
            searchbutton.disabled= false;
        }
        
        
    }


    function updateprogress(solved,total,label,circle){
        const progressdegree= (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressdegree}%`);
        label.textContent= `${solved}/${total}`;
    }


    function displayuserdata(parseddata){
        const totalacc_easyques= parseddata.data.userProfileUserQuestionProgressV2.numAcceptedQuestions[0].count;
        const totalacc_medques= parseddata.data.userProfileUserQuestionProgressV2.numAcceptedQuestions[1].count;
        const totalacc_hardques= parseddata.data.userProfileUserQuestionProgressV2.numAcceptedQuestions[2].count;

        console.log("easy: ", totalacc_easyques);
        console.log(totalacc_medques);
        console.log(totalacc_hardques);


        const totaleasy_unt_ques= parseddata.data.userProfileUserQuestionProgressV2.numUntouchedQuestions[0].count;
        const totalmed_unt_ques= parseddata.data.userProfileUserQuestionProgressV2.numUntouchedQuestions[1].count;
        const totalhard_unt_ques= parseddata.data.userProfileUserQuestionProgressV2.numUntouchedQuestions[2].count;

        updateprogress(totalacc_easyques,totaleasy_unt_ques,easylabel,easyprogresscircle);
        updateprogress(totalacc_medques,totalmed_unt_ques,mediumlabel,mediumprogresscircle);
        updateprogress(totalacc_hardques,totalhard_unt_ques,hardlabel,hardprogresscircle);

        const carddata1 =[
            {label: "Overall Easy Percentage: ", value:parseddata.data.userProfileUserQuestionProgressV2.userSessionBeatsPercentage[0].percentage },
            {label: "Overall Medium Percentage: ", value:parseddata.data.userProfileUserQuestionProgressV2.userSessionBeatsPercentage[1].percentage },
            {label: "Overall Hard Percentage: ", value:parseddata.data.userProfileUserQuestionProgressV2.userSessionBeatsPercentage[2].percentage },

        ];

        console.log("card ka data: ", carddata1);

        cardstatscontainer.innerHTML = carddata1.map(
            data1 => 
                    `<div class="card">
                    <h5>${data1.label}</h5>
                    <p>${data1.value}</p>
                    </div>`       
        ).join("")
    }




    searchbutton.addEventListener('click',function(){
        const username= usernameinput.value;
        console.log("logging username: ",username);
        if(validateusername(username)){
            fetchuserdetails(username);
        }
    })


})