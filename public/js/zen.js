var ui = (function() {


	function formatText( type, header, body ) {
		
		var text;
		switch( type ) {

			case 'html':
				header = "<h1>" + header + "</h1>";
				text = header + body;
				text = text.replace(/\t/g, '');
			break;

			case 'markdown':
				header = header.replace(/\t/g, '');
				header = header.replace(/\n$/, '');
				header = "#" + header + "#";
			
				text = body.replace(/\t/g, '');
			
				text = text.replace(/<b>|<\/b>/g,"**")
					.replace(/\r\n+|\r+|\n+|\t+/ig,"")
					.replace(/<i>|<\/i>/g,"_")
					.replace(/<blockquote>/g,"> ")
					.replace(/<\/blockquote>/g,"")
					.replace(/<p>|<\/p>/gi,"\n")
					.replace(/<br>/g,"\n");
				
				var links = text.match(/<a href="(.+)">(.+)<\/a>/gi);
				
				for ( var i = 0; i<links.length; i++ ) {
					var tmpparent = document.createElement('div');
					tmpparent.innerHTML = links[i];
					
					var tmp = tmpparent.firstChild;
					
					var href = tmp.getAttribute('href');
					var linktext = tmp.textContent || tmp.innerText || "";
					
					text = text.replace(links[i],'['+linktext+']('+href+')');
				}
				
				text = header +"\n\n"+ text;
			break;

			case 'plain':
				header = header.replace(/\t/g, '');
			
				var tmp = document.createElement('div');
				tmp.innerHTML = body;
				text = tmp.textContent || tmp.innerText || "";
				
				text = text.replace(/\t/g, '')
					.replace(/\n{3}/g,"\n")
					.replace(/\n/,""); //replace the opening line break
				
				text = header + text;
			break;
			default:
			break;
		}
		
		return text;
	}
