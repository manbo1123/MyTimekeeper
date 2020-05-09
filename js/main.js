
//ストップウォッチ機能
$(document).ready(function() {
  let timerFlag = 0;    // 0:停止中、1:動作中にする
  let timerActive;
  let sec = 0;
  let min = 0;
  let hour = 0;

//スタートとストップイベント発火
  $("#start").on("click", function() {    
    if( timerFlag=== 0) {  //停止中
      count_start();
    }else{
      count_stop();
    }
  });

//リセットイベント発火
  $("#reset").on("click", function() {
    count_reset();
  });

  //スタート動作を定義
  function count_start() {
    sec = 0;
    min = 0;
    hour = 0;

    $("#counter").html('00：00：00'); 
    $("#start").val("||");     //ボタンの表示をstopに変更
    timerFlag = 1;                //動作中にする
    timerActive = setInterval(count_up, 1000);  //カウントを開始(カウントアップの処理を1秒間隔で繰り返す)
  };

  //ストップ動作を定義
  function count_stop() {
    $("#start").val("▶︎");
    timerFlag = 0;
    clearInterval(timerActive);
  };

  //リセット動作を定義
  function count_reset() {
    sec = 0;
    min = 0;
    hour = 0;
    $("#counter").html('00：00：00'); //見た目もリセット
    $("#bar").attr("value", "100");
    if (timerFlag === 1) {      //動作中ならストップする
      count_stop();
    }
  };  

  //カウント方法を定義
  function count_up() {
    sec +=1;    
    if (min > 59) {
      min = 0;
      hour += 1;
    }
    if (sec > 59) {
      sec =0;
      min +=1;
    }
    sec_num = ('0'+sec).slice(-2);
    min_num = ('0' + min).slice(-2);
    hour_num = ('0'+ hour).slice(-2);

    $("#counter").html(hour_num + "：" + min_num + "：" + sec_num);
    percentage();
  };

  //フォームデータの取得
  $(function() {
    $(".mtgTab").on("click", function() {
      $("#out_title").html("本日の議題：<br>"+ $("#title").val().replace(/\r?\n/g, "<br>"));
      $("#out_goal").html("本日のゴール：<br>" + $("#goal").val().replace(/\r?\n/g, "<br>"));
      $("#meetingTime").text($("#mtgTime").val());
      $("#title").val("");
      $("#goal").val("");
      $("#mtgTime").val("");
    });
  });

  //プログレスバーの進捗割合計算
  function percentage() {
    currentTime = (sec/60 + min + hour*60 ) //カウント時間[min]を取得
    let percent = Math.round(100 - currentTime / $("#meetingTime").html() *100);
    $("#bar").attr("value", percent);
    $("#time").text(percent+" ％");

    //進捗に応じてメッセージを出力＋プログレスバーの色をvalueによって変化させる
    //-80%：ミーティング開始
    //50%：予定時間の半分が経過
    //70% 収束を促す
    //80% 次のアクション項目の整理
    //90% 次のアクション項目の優先度、スケジュール感を決定
    //100% タイムアップ
    if (percent > 50) {
      $("#message").html("ミーティング開始！<br>⚠️Agenda、ゴールの共有⚠️");
    } else if ( percent <= 50 && percent > 30) {
      $("#message").html("半分経過しました。<br>⚠️ゴールの再確認⚠️");
  //プログレスバーの進捗に合わせて色を変更はとりあえず未了のまま！！！！   
  //    $("#bar").css("background-color", 'green');

    } else if ( percent <= 30 && percent > 20) {
      $("#message").html("70%経過しました。<br>⚠️議論の収束を図ましょう⚠️");
  //    $("#bar").css("background-color", 'yellow');
    } else if ( percent <= 20 && percent > 10) {
      $("#message").html("80%経過しました。<br>⚠️アクション項目の整理⚠️");
  //    $("#bar").css("background-color", 'pink');
    } else if ( percent <= 10 && percent > 0) {
      $("#message").html("90%経過しました。<br>⚠️優先度、スケジュールの決定⚠️");
  //    $("#bar").css("background-color", 'red');
    } else {
      $("#message").html("タイムアップ！！<br>⚠️AI作成者を決めましょう⚠️<br>お疲れ様でした🤗");
  //    $("#bar").css("background-color", 'black');
    }
  };

  //タブの切り替え
  $(".tab").on("click", function() {
    $("#counter").html("00：00：00");
    count_reset();
    $("#time").text("0 ％");
    if ($(".formTab").hasClass("activeTab")) {
      if($("#mtgTime").val() === "") {
        alert('時間が入力されていません。半角数字で入力して下さい。');
        $(".mtgTab").removeClass("activeTab");
        $(".formTab").addClass("activeTab");
        $("#mtgTime").focus();
        return false;
      }
    }
    $(".tab").removeClass("activeTab");
    $(this).addClass("activeTab");

  //コンテンツの切り替え
    $(".activeContent").removeClass("activeContent");
    let index = $(".tab").index(this);
    $(".content").eq(index).addClass("activeContent");
  });
})

