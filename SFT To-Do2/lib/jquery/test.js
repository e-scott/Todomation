	// textarea auto resize
	$(function () {
	    var ta = $('textarea');
	    $(ta)
	        .focus()
	        .on('cut paste drop keydown', function (e) {
	            if (e.keyCode == 8 || ta.val() == '') {
	                ta.css('height', '30px');
	            }
	            setTimeout(function () {
	                ta.height(ta[0].scrollHeight - 13);
	                if (ta.val() == '')
	                    ta.css('height', '30px');
	            }, 0);
	        });

	    ta.css('height', '30px');
	    ta.height(ta[0].scrollHeight - 13);

	    // textarea auto resize
	    $('ul').on('cut paste drop keydown', 'textarea', function (e) {
	        var tA = $(this);
	        if (e.keyCode == 8 || tA.val() == '') {
	            tA.css('height', '27px');
	        }
	        setTimeout(function () {
	            tA.height(tA[0].scrollHeight - 13);
	            if (tA.val() == '')
	                tA.css('height', '30px');
	        }, 0);
	    })
	});