var scorelist = window.localStorage;

var ok = true;

var score = 0;

var playername;

var a = {}

var tleft = 1150, ttop = 530;
var pleft = 100, ptop = 513;

var first, second, third;
var firstname, secondname, thirdname;
 
$.get('http://10.10.10.143:9999/api/users', function(data){
    for (var i = 0; i < data.length; i++)
    {
        if (data[i].rank == "1"){
            first = data[i].score;
            firstname = data[i].name;
            $('#firstplace').text(first + ' - ' + firstname);
        }
        else if (data[i].rank == "2"){
            second = data[i].score;
            secondname = data[i].name;
            $('#secondplace').text(second + ' - ' + secondname);
        }
        else if (data[i].rank == "3"){
            third = data[i].score;
            thirdname = data[i].name;
            $('#thirdplace').text(third + ' - ' + thirdname);
        }
    }
})

var bgm = document.getElementById("bgmusic");
var die = document.getElementById("diemusic");
var jump = document.getElementById("jumpmusic");

bgm.volume = 0.1;
die.volume = 1;
jump.volume = 0.3;

$('#inputnamefirst').modal("show")

$("#namebutton").click(start)

function start() {
    playername = $('#nameinput input').val();
    setInterval(() => {
        turtlemove()
        //checkcollision();
    }, 1);
    setInterval(() => {
        score++;
        $('#scorenumber').text(score)
    }, 1000);
}

    //   $.get('http://127.0.0.1:9999/api/users', function(data){
    //     console.log(data);
    //   })
    //   $.post('http://127.0.0.1:9999/api/users', {name: 'yuan', score: 222}, function(){
    //     console.log(123)
    //   })

function checkcollision(){
    if ( Math.abs(pleft - tleft) <= 5 && Math.abs(ptop - ttop) < 35)
    {
        //console.log(first)
        if (Number(score) >= Number(first))
        {
            //console.log('changed ' + first + ' to ' + score);
            third = second;
            thirdname = secondname;
            $('#thirdplace').text(third + ' - ' + thirdname);
            
            second = first;
            secondname = firstname;
            $('#secondplace').text(second + ' - ' + secondname);

            first = score;
            firstname = playername;
            $('#firstplace').text(first + ' - ' + playername);

            // scorelist.setItem('First',first);
            // scorelist.setItem('FirstName',playername);
            console.log(playername , first)
            $.post('http://localhost:9999/api/users',{name: String(playername), score: String(first),rank: '1'})
            //a[playername] = 1
        }
        else if (Number(score) >= Number(second))
        {
            third = second;
            thirdname = secondname;
            $('#thirdplace').text(third + ' - ' + thirdname);

            second = score;
            secondname = playername;
            $('#secondplace').text(second + ' - ' + playername);
            // scorelist.setItem('Second',second);
            // scorelist.setItem('SecondName',playername);
            $.post('http://localhost:9999/api/users',{name: playername, score: second, rank: '2'})
            //a[playername] = 1
        }
        else if (Number(score) >= Number(third))
        {
            third = score;
            thirdname = playername;
            $('#thirdplace').text(third + ' - ' + playername);
            // scorelist.setItem('Third',third);
            // scorelist.setItem('ThirdName',playername);
            $.post('http://localhost:9999/api/users',{name: playername, score: third, rank: '3'})
            //a[playername] = 1
        }
        // console.log(first)
        // console.log(score);
        // console.log('--------')
        
        $('#gameover').modal("show");
        
        score = 0;
        $('#scorenumber').text('0');
        
        die.play();
        bgm.pause();
    }
    //console.log(Math.abs(pleft - tleft))
}

setInterval(() => {
    checkcollision();
}, 1);

function check(){
    var left = ($('#person').css("left")).split('px')[0];
    var top = ($('#person').css("top")).split('px')[0];
    if(left < 10 || left > (1192+10-46) || top < 0)
    {
         $('#outofbounds').modal("show")
    }
}

function turtlemove(){
    tleft = $('#turtle').css("left").split('px')[0];
    tleft -= (0.5 + score*0.02);
    $('#turtle').css("left",tleft);
    if (tleft <= 10)
    {
        tleft = 1150;
        $('#turtle').css("left",tleft);
    }
    //console.log(pleft);
}


function moveleft(){
    // $('#person').css("left",function(index,value){
    //     value = value.split('px');
    //     check();
    //     //console.log((Number(Number(value[0]) + 50 + Number(value[1]))));
    //     return (Number(Number(value[0]) - 1 + Number(value[1])));
    // })
    // console.log(" ");
    var l = ($('#person').css("left").split('px'))[0];
    // console.log(l);
    if(ok)
    {
        for (var i = 0; i < 100; i++)
        {
            if (ok){
                check();
                l--;
                setTimeout(() => {
                    $('#person').css("left",Number(l));
                }, 1);
                pleft = Number(l);
                //console.log(l);
            }
        }
    }
}

function moveright() {
    // //console.log("1")
    // $('#person').css("left",function(index,value){
    //     value = value.split('px');
    //     //console.log((Number(Number(value[0]) + 50 + Number(value[1]))));
    //     check();
    //     return (Number(Number(value[0]) + 1 + Number(value[1])));
    // })
    // console.log(" ");
    var l = ($('#person').css("left").split('px'))[0];
    // console.log(l);
    if (ok)
    {
        for (var i = 0; i < 100; i++)
        {
            if (ok){
                check();
                l++;
                setTimeout(() => {
                    $('#person').css("left",Number(l));
                }, 1);
                pleft = l;
                //console.log(l);
            }
        }
    }
}

function jumpup() {
    var value = $('#person').css("top");
    var h = value.split('px')[0];
    jump.play();
    // console.log(h+50);
    if (h == 513)
    {
        $('#person').css("top",Number(h)-100);
        check();
        setTimeout(() => {
            $('#person').css("top",Number(h));
        }, 300);
        ptop = h;
    }
}

ok = true;
$("#buttonleft").click(moveleft)
$("#buttonright").click(moveright)
$("#buttonjump").click(jumpup)

// $("#buttonleft").tap(moveleft)
// $("#buttonright").tap(moveright)
// $("#buttonjump").tap(jumpup)

$("html").keydown(function(e){
    ok = true;
    if(e.key == "ArrowRight")
    {
        moveright();
    }
    else if (e.key == "ArrowLeft")
    {
        moveleft();
    }
    else if (e.key == "ArrowUp")
    {
        jumpup();
    }
})

$("html").keyup(function(e){
    ok = false;
    //console.log("KEYUP")
})

$("#okbutton").click(function(){
    $('#person').css("left",100);
    $('#person').css("top",513);
})
$("#closebutton").click(function(){
    $('#person').css("left",100);
    $('#person').css("top",513);
})

// Uncomment to enable Bootstrap tooltips
// https://getbootstrap.com/docs/4.0/components/tooltips/#example-enable-tooltips-everywhere
// $(function () { $('[data-toggle="tooltip"]').tooltip(); });

// Uncomment to enable Bootstrap popovers
// https://getbootstrap.com/docs/4.0/components/popovers/#example-enable-popovers-everywhere
// $(function () { $('[data-toggle="popover"]').popover(); });
