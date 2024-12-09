/**
 * Extends the contact events.
*/
export default function (contact) {
    console.debug("CDEBUG >> ContactEvents - New Contact contactId: " + contact.contactId);
    console.debug("CDEBUG >> ContactEvents - New Contact InitialContactId(): " + contact.getInitialContactId());

    // Route to the respective handler
    contact.onIncoming(handleContactIncoming);
    contact.onAccepted(handleContactAccepted);
    contact.onConnecting(handleContactConnecting);
    contact.onConnected(handleContactConnected);
    contact.onEnded(handleContactEnded);
    contact.onDestroy(handleContactDestroyed);
    contact.onMissed(handleContactMissed);

    function handleContactIncoming(contact) {
        console.debug('CDEBUG >> ContactEvents.handleContactIncoming');

    }

    function handleContactAccepted(contact) {
        console.debug('CDEBUG >> ContactEvents.handleContactAccepted - Contact accepted by agent');
        // Add your custom code here
        // Extract attributes
        var contactAttr = contact.getAttributes()
        // Iterate attributes and populate the table
        try {
            let tbody = document.getElementById("attributes").getElementsByTagName('tbody')[0];

            Object.values(contactAttr).forEach((attribute) => {
                let attrName = attribute.name;
                let attrValue = attribute.value;
                let tr = tbody.insertRow();
                var td1 = tr.insertCell();
                var td2 = tr.insertCell();
                td1.innerHTML = attrName;
                td2.innerHTML = attrValue;
            })
        } catch (e) {
            console.error("CDEBUG >> ContactEvents.handleContactConnecting() - Error!! ", e);
        }

    }

    function handleContactConnecting(contact) {
        console.debug('CDEBUG >> ContactEvents.handleContactConnecting() - Contact connecting to agent');
        // Add your custom code here
        console.log("đang ở sự kiện reng chuông")
        change_so_dien_thoai();
        //  setTimeout(() => {
        //      console.log("5 second has passed");
        //      var bien_phone = document.getElementById("connectionTab-primary-participant");
        //      if(bien_phone)
        //      {
        //          console.log("bien_phone ok");
        //          bien_phone.innerText = "0908895445";
        //      }
        //      else
        //      {
        //          console.log("bien_phone not found")
        //      }

        //      var bien_id = document.getElementById("attributes");
        //      if(bien_id)
        //      {
        //          console.log("bien_id ok");

        //      }
        //      else
        //      {
        //          console.log("bien_id not found")
        //      }

        //  }, 2000);



    }


    function change_so_dien_thoai() {
        console.log("change_so_dien_thoai")
        // Lấy tham chiếu đến iframe
        var iframe = document.querySelector('iframe[name="Amazon Connect CCP"]');

        // Kiểm tra xem iframe có tồn tại không
        if (iframe) {
            console.log("ok 1");
            console.log(iframe);
            // Lấy tham chiếu đến contentWindow của iframe
            var iframeWindow = iframe.contentWindow;
            console.log("ok 2");
            console.log(iframeWindow);
            // Lấy tham chiếu đến document của iframe
            var iframeDocument = iframeWindow.document;
            console.log("ok 3");
            // Lấy phần tử bên trong iframe
            var elementInsideIframe = iframeDocument.getElementById('connectionTab-primary-participant');
            console.log("ok 4");
            // Kiểm tra xem phần tử có tồn tại trong iframe hay không
            if (elementInsideIframe) {
                console.log("ok 5");
                // Thực hiện các hành động mong muốn với phần tử bên trong iframe ở đây
                elementInsideIframe.innerText = "0908895445";
            } else {
                console.log("Không tìm thấy phần tử bên trong iframe");
            }
        } else {
            console.log("Không tìm thấy iframe");
        }
    }

    function handleContactConnected(contact) {
        console.debug('CDEBUG >> ContactEvents.handleContactConnected() - Contact connected to agent');
    }

    function handleContactEnded(contact) {
        console.debug('CDEBUG >> ContactEvents.handleContactEnded() - Contact has ended successfully');
        // Add your custom code here
        // Delete Table
        let tableBody = document.getElementById("attributes").getElementsByTagName('tbody')[0];
        tableBody.innerHTML = "";
    }

    function handleContactDestroyed(contact) {
        console.debug('CDEBUG >> ContactEvents.handleContactDestroyed() - Contact will be destroyed');
        // Add your custom code here
        let tableBody = document.getElementById("attributes").getElementsByTagName('tbody')[0];
        tableBody.innerHTML = "";
    }

    function handleContactMissed(contact) {
        console.debug('CDEBUG >> ContactEvents.handleContactMissed() - Contact was missed');
    }

}