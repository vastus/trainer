$(function(){    
    $(".code").each(function(){
        CodeMirror.fromTextArea(this, {
            mode: 'text/x-sql',
            indentWithTabs: true,
            smartIndent: true,
            lineNumbers: true,
            matchBrackets : true,
            autofocus: true,
            theme: 'monokai',
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Ctrl-Enter" : handleSubmit,
                "Cmd-Enter" : handleSubmit
            }
        });
    });
    function handleSubmit() {
        var form = $('#form');
	if(form.length != 0)
	    form.submit();
    }
});
