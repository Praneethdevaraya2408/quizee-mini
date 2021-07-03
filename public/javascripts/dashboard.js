import userObject from './ls.js';
$("#app").hide();
$( document ).ready( function ()
{
    $( '#Logoutbtn' ).click( function ()
    {
        userObject.removeCurrentUser();
        $.ajax( {
            type: "POST",
            url: "/api/user/logout",
            data: {},
        } );
        location.href = "/";
    } );

    $("#app").hide();  
    var createquiz = false
    var cnt = 1
    var quizlength = 0
    var quiz_Code = ''

    // Author Tab
    $( "#forminner" ).hide()
    $( "#terminals" ).hide()
    $( '#createquiz' ).click( function ()
    {
        createquiz = true
        if ( createquiz == true )
        {
            $( "#created" ).hide();
            //$("#quizform").show();
            var defhtml = `<div class="form-group" id="qname"><label for="quizname" class="form-label mt-4">Quiz name</label><input type="text" class="form-control" id="quizname" aria-describedby="emailHelp" placeholder="Enter Quiz name"></div><div class="form-group" id="qdur"><label for="quizname" class="form-label mt-4">Quiz duration</label><input type="number" value="5" min="0" step="5" class="form-control" id="quizduration" aria-describedby="emailHelp" placeholder="Enter Quiz duration"></div><div id="1"><div class="form-group" ><label for="question1" class="form-label mt-4">Question 1</label><input id="1question" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter question"></div><div class="form-group" ><label for="quizname" class="form-label mt-4">Options</label><input  type="text" class="form-control" id="1opt1" aria-describedby="emailHelp" placeholder="Enter Option1"></div>
            <div class="form-group" >&nbsp;
            <input type="text" class="form-control" id="1opt2" aria-describedby="emailHelp" placeholder="Enter Option2">
          </div>
          <div class="form-group" >&nbsp;
            <input type="text" class="form-control" id="1opt3" aria-describedby="emailHelp" placeholder="Enter Option3">
          </div>
          <div class="form-group" >&nbsp;
            <input type="text" class="form-control" id="1opt4" aria-describedby="emailHelp" placeholder="Enter Option4">
          </div>
          <div class="form-group">
            <label for="crctoption" class="form-label mt-4">Select the Correct Option</label>
            <select class="form-select" id="1crctoption">
              <option >1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </div>
        
          <hr>
        </div>`;


            $( "#forminner" ).html( '' );
            $( "#forminner" ).html( defhtml );
            $( "#forminner" ).show();
            $( "#terminals" ).show();
            $( '#createquiz' ).hide();
        }
    } );
    $( '#addquestion' ).click( function ()
    {

        cnt++;
        var z = document.createElement( 'div' ); // is a node
        z.innerHTML = '<div id=' + cnt + '><div class="form-group" > <label for="question1" class="form-label mt-4">Question ' + cnt + '</label><input type="text" id="' + cnt + 'question" class="form-control" aria-describedby="emailHelp" placeholder="Enter question"></div><div class="form-group" ><label for="quizname" class="form-label mt-4">Options</label> <input type="text" class="form-control" id="' + cnt + 'opt1" aria-describedby="emailHelp" placeholder="Enter Option1"> </div><div class="form-group"  >&nbsp;<input type="text" class="form-control" id="' + cnt + 'opt2" aria-describedby="emailHelp" placeholder="Enter Option2"></div><div class="form-group">&nbsp;<input type="email" class="form-control" id="' + cnt + 'opt3" aria-describedby="emailHelp" placeholder="Enter Option3"></div><div class="form-group" >&nbsp; <input type="email" class="form-control" id="' + cnt + 'opt4" aria-describedby="emailHelp" placeholder="Enter Option4"></div><div class="form-group"  ><label for="crctoption" class="form-label mt-4">Select the Correct Option</label><select class="form-select" id="' + cnt + 'crctoption"><option>1</option><option>2</option><option>3</option><option>4</option></select></div><hr></div>';
        //document.body.appendChild(z);
        document.getElementById( 'forminner' ).appendChild( z );
    } );
    $( '#deletequestion' ).click( function ()
    {

        $( '#' + cnt ).remove()
        cnt--;
    } );
    $( '#clearquiz' ).click( function ()
    {

        location.href = "/dashboard";
    } );
    $( "#submitquestion" ).click( function ()
    {
        //var quizobj={quizName:'',author:'',questions:[],quizDuration:''};
        var quizName = $( "#quizname" ).val();
        var quizDuration = parseInt( $( "#quizduration" ).val() );
        var author = userObject.getCurrentUserId();
        var questions = [];
        console.log( cnt );
        for ( var i = 1; i <= cnt; i++ )
        {       //var quesobj={description:'',options:[],correctAnswer:0};
            var description = $( '#' + i + "question" ).val();
            var correctAnswer = parseInt( $( '#' + i + "crctoption" ).val() );
            //console.log(quesobj.correctAnswer);
            var opt = [];
            for ( var j = 1; j <= 4; j++ )
            {
                var optval = $( "#" + i + "opt" + j ).val();
                opt.push( optval );
            }
            var quesobj = {description: description, correctAnswer: correctAnswer, options: opt};
            //quesobj.options=opt;
            questions.push( quesobj );
        }
        var quizobj = {quizName: quizName, quizDuration: quizDuration, author: author, questions: JSON.stringify( questions )};
        //quizobj.questions=questions;  
        console.log( quizobj );

        $.ajax( {
            type: "POST",
            url: '/dashboard/api/quiz/create',
            data: quizobj,
            success: function ( data )
            {
                if ( data.success )
                {
                    console.log( "inserted" );
                    console.log( data.quizCode );
                    // $("#quizform").hide();
                    $( "#forminner" ).hide();
                    $( "#terminals" ).hide();
                    $( "#createquiz" ).show();
                    $( "#quizcreatedid" ).html( data.quizCode );
                    $( "#created" ).show();
                    //userObject.saveUserInLocalStorage( data );
                    // location.href = "/dashboard";
                }
                else
                    toastr.error( data.error );
            },
        } );


    } );


    // Participate Tab

                    $( '#participatequiz' ).click( function ()
                    {
                        //var quizidobj={quizid:''};
                        //console.log("pressed");
                        var quizCode = $( "#quizid" ).val();
                        //console.log(quizCode);  
                        //$("#quizsubmitform").html('');
                        $.ajax( {
                            method: 'GET',
                            url: `/dashboard/api/quiz/${quizCode}`,
                            //data:quizCode,
                            success: function ( data )
                            {
                                if ( data.success )
                                {
                                    console.log( data.quiz );
                                    console.log( data.quiz.quizName );
                                    //console.log(data.quiz.questions.length);
                                    $("#app").show();
                                    var duration=data.quiz.quizDuration;
                                    timer(duration)
                                    quizlength = data.quiz.questions.length;
                                    quiz_Code = data.quiz._id;
                                    $( "#quiztitle" ).html( data.quiz.quizName );
                                    var quizquestionsobj = data.quiz.questions;
                                    for ( var k = 0; k < quizquestionsobj.length; k++ )
                                    {
                                        var c = k + 1;
                                        var quesattempting = quizquestionsobj[k].description;
                                        var optattempting = quizquestionsobj[k].options;
                                        var quizques = document.createElement( 'div' );
                                        quizques.innerHTML = `<fieldset class="form-group" id="${c}-set">
                                    <legend class="mt-4" id="${c}-dispquestion">${c}Q)  ${quesattempting}</legend>
                                    <div class="form-check">
                                        <label class="form-check-label">
                                        <input type="radio" class="form-check-input" name="${c}-question" id="${c}-option1" value="1" >
                                        ${optattempting[0]}
                                        </label>
                                    </div>
                                    <div class="form-check">
                                    <label class="form-check-label">
                                        <input type="radio" class="form-check-input" name="${c}-question" id="${c}-option2" value="2">
                                        ${optattempting[1]}
                                    </label>
                                    </div>
                                    <div class="form-check">
                                        <label class="form-check-label">
                                        <input type="radio" class="form-check-input" name="${c}-question" id="${c}-option3" value="3">
                                        ${optattempting[2]}
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <label class="form-check-label">
                                        <input type="radio" class="form-check-input" name="${c}-question" id="${c}-option4" value="4">
                                        ${optattempting[3]}
                                        </label>
                                    </div>
                                </fieldset>`;

                                        document.getElementById( 'quizsubmitform' ).appendChild( quizques );
                                    }
                                    $( "#quizsubmitform" ).show();
                                    $( "#submitquizbutton" ).show();
                                    $( "#q-name" ).hide();

                                    $( "#participatequiz" ).hide();

                                }
                                else
                                    toastr.error( data.error );
                            }
                        } )


                    } );

                    $( "#submitquizbutton" ).click( function ()
                    {
                        //$("#participatequiz").hide();

                        var responses = [];
                        //console.log(quizlength);
                        for ( var y = 1; y <= quizlength; y++ )
                        {
                            var tempobj = $( `input[name='${y}-question']:checked` ).val();

                            if ( tempobj == undefined )
                                tempobj = 0;


                            responses.push( parseInt( tempobj ) );
                        }
                        console.log( responses );
                        $.ajax( {
                            type: "POST",
                            url: '/dashboard/api/quiz/submit',
                            data: {quizCode: quiz_Code, responses: JSON.stringify( responses )},
                            success: function ( data )
                            {
                                if ( data.success )
                                {
                                    console.log( data.marks );
                                    toastr.success( "Quiz Submitted Sucessfully " );
                                    $( "#marks" ).html( data.marks );
                                    $( "#marks_declaration" ).show();
                                    $( "#marksokbutton" ).show();
                                    $( "#q-name" ).hide();
                                    // $("#quizidlabel").hide();
                                    // $("#quizid").hide();
                                    //$("#quizid").val('');

                                }
                                else
                                {
                                    toastr.error( data.error );
                                    $( "#q-name" ).show();
                                    $( "#quizid" ).val( '' );
                                    $( "#participatequiz" ).show();
                                }
                            },
                        } );
                        $( "#quiztitle" ).html( '' );
                        $( "#quizsubmitform" ).html( '' );
                        $( "#submitquizbutton" ).hide();
                        // $("#q-name").show();
                        // $("#participatequiz").show();
                        // $("#quizid").val('');


                    } );
                    $( "#marksokbutton" ).click( function ()
                    {

                        $( "#q-name" ).show();
                        $( "#quizid" ).val( '' );
                        $( "#participatequiz" ).show();
                        $( "#marks" ).html( '' );
                        $( "#marks_declaration" ).html( '' );
                        $( "#marksokbutton" ).hide();

                    } );

    //Leader Board Tab

    
    $("#leaderboard-tab").click(function(){
        var quizzesParticipatedId=userObject.getCurrentUserId();

        $.ajax( {
            method: 'GET',
            url: `/dashboard/api/quiz/participated/${quizzesParticipatedId}`,
            success:function(data)
            {
                    if(data.success)
                        {   var qarray=data.quizDetails;
                           
                            console.log("quizzes received");
                            console.log(qarray);
                            for(var qz=0;qz<qarray.length; qz++)
                            {
                                    var qid=qz+1;
                                    //console.log()
                                    var quizofuser = document.createElement( 'div' );
                                    quizofuser.classList.add("col");
                                    quizofuser.classList.add("span_1_of_3");
                                    quizofuser.innerHTML =`
                                    <div class="card text-white bg-dark mb-3"  style="max-width: 20rem;">
                                    <div class="card-header">${qarray[qz].quizName}</div>
                                    <div class="card-body"  id="${qid}-quizparticipated">
                                      <h4 class="card-title">${qarray[qz].quizName}</h4>
                                      <p class="card-text" >User Id: ${qarray[qz].author}</p>
                                      <p class="card-text" id="${qid}-quizname">Quiz Id: ${qarray[qz]._id}</p>
                                      <p class="card-text" >Duration: ${qarray[qz].quizDuration} min</p>
                                      <button type="button" class="btn btn-secondary" id="${qarray[qz]._id}" onclick="myFunction(event)">Get Leader Board</button>
                                    </div>
                                  </div>`
                                  document.getElementById( 'quizparticipatedlist' ).appendChild( quizofuser );
                            }
                           $("#quizparticipatedlist").show();
                        }
                    else{
                        toastr.error( data.error );
                    }
            }

                 });
       
            } );

    //clicking ok after viewing leader board            
    
    $("#lb-okbutton").click(function(){
        $("#lb-table-body").html('');
        $("#leaderboardheading").hide();
        $("#lb-table").hide();
        $("#lb-okbutton").hide();
        $("#quizheading").show();
        $("#quizparticipatedlist").show();
    });

    //on shiftingto other tabs
    $("#home-tab").click(function(){
        $("#quizparticipatedlist").html('');
    });
    $("#profile-tab").click(function(){
        $("#quizparticipatedlist").html('');
    });
});

var timer=function(duration){
    const TIME_LIMIT = 60*duration; // Give time here
    const FULL_DASH_ARRAY = 283;
    const WARNING_THRESHOLD = 0.40*TIME_LIMIT;
    const ALERT_THRESHOLD = 0.15*TIME_LIMIT;
    
    const COLOR_CODES = {
      info: {
        color: "green"
      },
      warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
      },
      alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
      }
    };
    
    let timePassed = 0;
    let timeLeft = TIME_LIMIT;
    let timerInterval = null;
    let remainingPathColor = COLOR_CODES.info.color;
    
    document.getElementById("app").innerHTML = `
    <div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining ${remainingPathColor}"
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
      <span id="base-timer-label" class="base-timer__label">${formatTime(
        timeLeft
      )}</span>
    </div>
    `;
    
    startTimer();
    
    function onTimesUp() {
      clearInterval(timerInterval);
      console.log("time up");
      
      
    }
    
    function startTimer() {
      timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        document.getElementById("base-timer-label").innerHTML = formatTime(
          timeLeft
        );
        setCircleDasharray();
        setRemainingPathColor(timeLeft);
    
        if (timeLeft === 0) {
          onTimesUp();
          $('#submitquizbutton').trigger('click');
        }
      }, 1000);
    }
    
    function formatTime(time) {
      const minutes = Math.floor(time / 60);
      let seconds = time % 60;
    
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
    
      return `${minutes}:${seconds}`;
    }
    
    function setRemainingPathColor(timeLeft) {
      const { alert, warning, info } = COLOR_CODES;
      if (timeLeft <= alert.threshold) {
        document
          .getElementById("base-timer-path-remaining")
          .classList.remove(warning.color);
        document
          .getElementById("base-timer-path-remaining")
          .classList.add(alert.color);
      } else if (timeLeft <= warning.threshold) {
        document
          .getElementById("base-timer-path-remaining")
          .classList.remove(info.color);
        document
          .getElementById("base-timer-path-remaining")
          .classList.add(warning.color);
      }
    }
    
    function calculateTimeFraction() {
      const rawTimeFraction = timeLeft / TIME_LIMIT;
      return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    }
    
    function setCircleDasharray() {
      const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
      ).toFixed(0)} 283`;
      document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
    }
    }
