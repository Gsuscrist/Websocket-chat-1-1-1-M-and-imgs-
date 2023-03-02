$(function () {
    let DataURL;
    // socket.io client side connection
    const socket = io.connect();

    // obtaining DOM elements from the Chat Interface
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');
    //files
    const fileInput = document.querySelector('#file-Input');
    const sendFile = document.querySelector('#send-File');

    // obtaining DOM elements from the NicknameForm Interface
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');

    // obtaining the usernames container DOM
    const $users = $('#usernames');

    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), data => {
            if(data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                $nickError.html(`
            <div class="alert alert-danger">
              That username already Exists.
            </div>
          `);
            }
        });
        $nickname.val('');
    });

    // events
    $messageForm.submit( e => {
        e.preventDefault();
        socket.emit('send message', $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`)
        });
        $messageBox.val('');
    });

    socket.on('new message', data => {
        $chat.append(`<p class="msg"><b>${data.nick}</b>: ${data.msg}</p>`);
    });

    socket.on('usernames', data => {
        let html = '';
        for(i = 0; i < data.length; i++) {
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`;
        }
        $users.html(html);
    });

    //send file
    socket.on('file_received', (file) => {
        const files = document.getElementById('files');
        const newFile = document.createElement('li');
        const fileLink = document.createElement('a');
        fileLink.setAttribute('href', file.base64);
        fileLink.setAttribute('download', file.name);
        fileLink.innerText = file.name;
        newFile.appendChild(fileLink);
        files.appendChild(newFile);
    });
        //actioner file
        sendFile.addEventListener('click',()=>{
            fileInput.click();
        })

        // sendFile
      fileInput.addEventListener('click',(e)=>{
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              DataURL = reader.result
          };
          reader.readAsDataURL(file);
          DataURL ?  socket.emit('sendFile',{image:DataURL})  : alert('Adjunte una vez mas para confirmar');
      })

    //show file
    socket.on('sendFile', data=>{
        $chat.append(`<p><b>${data.nick}</b></p><br><img src="${data.image}">`)
    })



    socket.on('whisper', data => {
        $chat.append(`<p class="whisper"><b>${data.nick}</b>: ${data.msg}</p>`);
    });

});
