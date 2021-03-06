/*
/ Doxa en hypsistois Theo, kai epi ges eirene, en anthropois eudokia.
*/

//===================================================================
//Standard constants


var TristateFalse = 0
var TristateMixed = -2
var TristateTrue = -1
var TristateUseDefault = -2
	
var WshFinished = 1
var WshFailed = 2

var ForReading = 1, ForWriting = 2, ForAppending = 8

var BIF_NEWDIALOGSTYLE =0x00000040

var BIF_RETURNONLYFSDIRS   = 0x0001 
var BIF_DONTGOBELOWDOMAIN  = 0x0002
var BIF_STATUSTEXT         = 0x0004
var BIF_RETURNFSANCESTORS  = 0x0008
var BIF_EDITBOX            = 0x0010
var BIF_VALIDATE           = 0x0020
var BIF_NONEWFOLDER        = 0x0200
var BIF_BROWSEFORCOMPUTER  = 0x1000
var BIF_BROWSEFORPRINTER   = 0x2000
var BIF_BROWSEINCLUDEFILES = 0x4000
//These can be combined e.g. BIF_EDITBOX + BIF_NONEWFOLDER

//StartPath     A drive/folder path or one of the following numeric constants: 
var DESKTOP = 0
var PROGRAMS = 2
var DRIVES = 17
var NETWORK = 18
var NETHOOD = 19
var PROGRAMFILES = 38
var PROGRAMFILESx86 = 48
var WINDOWS = 36


var illicitFilenameChars = '/\\*?"<>|:'

//============================================================

var oStream = new ActiveXObject("ADODB.Stream")
var shApp = new ActiveXObject("Shell.Application")


var fso =  new ActiveXObject("scripting.filesystemobject");
var wShell = new ActiveXObject("WScript.Shell");
var xmlhttp=new ActiveXObject("MSXML2.ServerXMLHTTP.6.0")


//============================================================

var desktopPath= wShell.SpecialFolders("Desktop")
var downloadsPath = fso.BuildPath(fso.GetParentFolderName(desktopPath), "Downloads")
var IncludesPaths=["..\\includes", "includes"];
var settingsFile="settings.inc";

var scriptPath, scriptFile

if(typeof document!="undefined")
{	//if under hta environment
	strHtmlLoc = document.location.href 
	scriptPath = URIToWindows(fso.GetParentFolderName(strHtmlLoc))
	
	wShell.CurrentDirectory=scriptPath
	
	//Include files.
	Includes(IncludesPaths);
	if (fso.GetFileName(scriptPath)!="scripts") Includes([scriptPath]);

	if (fso.FileExists(settingsFile))
	Include (settingsFile);
	
} else {
	//if under cscript

}



//============================================================

function Includes(paths)
{
	for(i in paths) {
		var path=paths[i];
		if (fso.FolderExists(path)) {
			var files = fso.getfolder(path).Files;
			for(objEnum = new Enumerator(files); !objEnum.atEnd(); objEnum.moveNext()) {
				inc=objEnum.item();
				if (fso.GetFileName(inc)=="include.js") continue;
				
				if (fso.GetExtensionName(inc).match(/^js$|^vbs$|^inc$/)) Include(inc.Path);
			}
		}
	}
}

function Include(inc) {
	if (fso.GetExtensionName(inc)=="js") {lang="javascript";} else {lang="vbscript";}
		 
 	document.head.appendChild (CreateHTMLElement("script", "language",
		lang, "src", inc)); 
}

function URIToWindows(htmlPath){
	return htmlPath.replace(/^file:\/\/\//, '').replace(/\%20/g, ' ').replace(/\//g, '\\');

	
	var parser = document.createElement('a');
	
	parser.href = "http://example.com:3000/pathname/?search=test#hash";
	
	
	parser.protocol; // => "http:"
	
	parser.hostname; // => "example.com"
	
	parser.port;     // => "3000"
	
	parser.pathname; // => "/pathname/"
	
	parser.search;   // => "?search=test"
	
	parser.hash;     // => "#hash"
	
	parser.host;     // => "example.com:3000"	
}



/*
// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License

function parseUri (str) {
	var	o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
};

parseUri.options = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};
*/


//Here is a function that takes data rows (array of arrays or array of plain objects),
//and the indexes/keys of the columns/fields by which to group and pivot the data.
//It produces the innerHTML that can be used for a table element.

/*
 Create table HTML: only pass data (no labels). 
 Pass column indexes/keys for:
 - the column with the values for the cells, 
 - the row headers, and 
 - the column headers
 Optionally provide callback for aggregating data that ends up in same cell
*/

/*
function pivotTable(data, valueColumn, groupColumns, pivotColumns, aggregator = x=>x.length ? x[0] : "") {
    // Helper function
    function span(...args) {
        return [" rowspan", " colspan"].map((dim, i) =>
            args[i] > 1 ? dim + '="' + args[i] + '"' : ""
        ).join``;
    }

    // Structure dimensions:
    const [groups, pivots] = [groupColumns, pivotColumns].map(columns => {
        const colMap = {};
        for (const row of data) {
            columns.reduce((acc, colNo) => (acc[row[colNo]] = acc[row[colNo]] || {}), colMap);  
        }
        const headers = columns.map(col => []);
        const tree = (function process(colMap, y=0, x=0) {
            return Object.entries(colMap).reduce((acc, [title, obj]) => {
                const result = process(obj, y+1, x);
                const size = result.size || 1;
                result.title = title;
                acc.children[title] = result;
                acc.size += size;
                headers[y].push(result);
                x += size;
                return acc;
            }, { title: null, x, size: 0, children: {} });
        })(colMap);
        tree.headers = headers;
        return tree;
    });
    
    // Collect data in matrix, per dimensions:
    const matrix = Array.from({length:groups.size}, row => Array.from({length:pivots.size}, cell => []));
    for (const row of data) {
        const y = groupColumns.reduce((acc, colNo) => acc.children[row[colNo]], groups).x;
        const x = pivotColumns.reduce((acc, colNo) => acc.children[row[colNo]], pivots).x;
        matrix[y][x].push(row[valueColumn]);
    }
    matrix.forEach(row => row.forEach((values,i) => row[i] = aggregator(values)));
    
    // Produce HTML for column headers:
    let html = `<tr><th${span(groupColumns.length, pivotColumns.length)}></th>${
        pivots.headers.map(header => header.map(o => `<th${span(1, o.size)}>${o.title}</th>`).join``).join("</tr>\n<tr>")
    }</tr>`;

    // Produce HTML for the row headers and cells:
    let startRow = true;
    let y = 0;
    (function loop(children, depth=0) {
        Object.values(children).map(group => {
            if (startRow) html += "<tr>";
            startRow = false;
            html += `<th${span(group.size, 1)}>${group.title}</th>`;
            loop(group.children, depth+1);
        });
        if (depth >= groupColumns.length) {
            html += `${matrix[y].map(value => `<td>${value}</td>`).join``}</tr>\n`;
            startRow = true;
            y++;
        }
    })(groups.children);
    
    return html;
}

// Demo where data is structured as array of arrays:
const data = [["lemma","form","tense","mood","voice","person","number"],["πιστεύω","πεπίστευκα","perf","ind","act","1st","sg"],["πιστεύω","πεπιστεύκαμεν","perf","ind","act","1st","pl"],["πιστεύω","πεπίστευκας","perf","ind","act","2nd","sg"],["πιστεύω","πεπιστεύκατε","perf","ind","act","2nd","pl"],["πιστεύω","πεπιστεύκειν","perf","inf","act","",""],["πιστεύω","πεπιστεύκειν","plup","ind","act","1st","sg"],["πιστεύω","πεπιστεύκεισαν","plup","ind","act","3rd","pl"],["πιστεύω","πεπίστευκεν","perf","ind","act","3rd","sg"],["πιστεύω","πεπίστευκεν","perf","inf","act","",""],["πιστεύω","πεπίστευκεν","perf","inf","act","3rd","sg"],["πιστεύω","πεπίστευκεν","plup","ind","act","3rd","pl"],["πιστεύω","πεπιστευκέναι","perf","inf","act","",""],["πιστεύω","πεπίστευμαι","perf","ind","mp","1st","sg"],["πιστεύω","πεπίστευμαι","perf","ind","pass","1st","sg"],["πιστεύω","πεπίστευνται","perf","ind","mid","3rd","pl"],["πιστεύω","πεπίστευνται","perf","ind","mp","3rd","pl"],["πιστεύω","ἐπεπίστευντο","plup","ind","mp","3rd","pl"],["πιστεύω","πεπίστευται","perf","ind","mid","3rd","sg"],["πιστεύω","πεπίστευται","perf","ind","mp","3rd","sg"],["πιστεύω","ἐπεπίστευτο","plup","ind","mp","3rd","sg"],["πιστεύω","πιστεῦσαι","aor","imperat","mid","2nd","sg"],["πιστεύω","πιστεῦσαι","aor","inf","act","",""],["πιστεύω","πιστεῦσαι","aor","inf","act","3rd","sg"],["πιστεύω","πιστεῦσαι","aor","opt","act","3rd","sg"],["πιστεύω","πιστεῦσαν","aor","ind","act","3rd","pl"],["πιστεύω","πιστεύῃ","pres","ind","act","3rd","sg"],["πιστεύω","πιστεύῃ","pres","ind","mp","2nd","sg"],["πιστεύω","πιστεύῃ","pres","subj","act","3rd","sg"],["πιστεύω","πιστεύῃ","pres","subj","mp","2nd","sg"],["πιστεύω","πίστευε","imperf","ind","act","3rd","sg"],["πιστεύω","πίστευε","pres","imperat","act","2nd","sg"],["πιστεύω","πιστεύει","pres","ind","act","3rd","sg"],["πιστεύω","πιστεύει","pres","ind","mp","2nd","sg"],["πιστεύω","πιστεύειν","pres","inf","act","",""],["πιστεύω","πιστεύεις","pres","ind","act","2nd","sg"],["πιστεύω","ἐπίστευεν","imperf","ind","act","3rd","sg"],["πιστεύω","πιστεύεσθαι","pres","inf","mp","",""],["πιστεύω","πιστεύεται","pres","ind","mp","3rd","sg"],["πιστεύω","πιστεύετε","imperf","ind","act","2nd","pl"],["πιστεύω","πιστεύετε","pres","imperat","act","2nd","pl"],["πιστεύω","πιστεύετε","pres","ind","act","2nd","pl"],["πιστεύω","πιστευέτω","pres","imperat","act","3rd","sg"],["πιστεύω","πιστεύητε","pres","subj","act","2nd","pl"],["πιστεύω","πιστευθῇ","aor","subj","pass","3rd","sg"],["πιστεύω","ἐπιστεύθη","aor","ind","pass","3rd","sg"],["πιστεύω","πιστεύσῃ","aor","subj","act","3rd","sg"],["πιστεύω","πιστεύσῃ","aor","subj","mid","2nd","sg"],["πιστεύω","πιστεύσῃ","fut","ind","mid","2nd","sg"],["πιστεύω","πιστεύῃς","pres","subj","act","2nd","sg"],["πιστεύω","ἐπίστευσα","aor","ind","act","1st","sg"],["πιστεύω","πιστεύσαι","aor","imperat","mid","2nd","sg"],["πιστεύω","πιστεύσαι","aor","inf","act","",""],["πιστεύω","πιστεύσαι","aor","inf","act","3rd","sg"],["πιστεύω","πιστεύσαι","aor","opt","act","3rd","sg"],["πιστεύω","ἐπιστεύσαμεν","aor","ind","act","1st","pl"],["πιστεύω","ἐπίστευσαν","aor","ind","act","3rd","pl"],["πιστεύω","πιστευσάντων","aor","imperat","act","3rd","pl"],["πιστεύω","πιστεύσας","aor","ind","act","2nd","sg"],["πιστεύω","ἐπίστευσας","aor","ind","act","2nd","sg"],["πιστεύω","πιστεύσατε","aor","imperat","act","2nd","pl"],["πιστεύω","ἐπιστεύσατε","aor","ind","act","2nd","pl"],["πιστεύω","ἐπίστευσε","aor","ind","act","3rd","sg"],["πιστεύω","πιστεύσει","aor","subj","act","3rd","sg"],["πιστεύω","πιστεύσει","fut","ind","act","3rd","sg"],["πιστεύω","πιστεύσει","fut","ind","mid","2nd","sg"],["πιστεύω","πιστεύσειν","fut","inf","act","",""],["πιστεύω","πιστεύσεις","aor","subj","act","2nd","sg"],["πιστεύω","πιστεύσεις","fut","ind","act","2nd","sg"],["πιστεύω","ἐπίστευσεν","aor","ind","act","3rd","sg"],["πιστεύω","πιστεύσετε","aor","subj","act","2nd","pl"],["πιστεύω","πιστεύσετε","fut","ind","act","2nd","pl"],["πιστεύω","πιστεύσητε","aor","subj","act","2nd","pl"],["πιστεύω","πιστεύσητε","fut","ind","act","2nd","pl"],["πιστεύω","πιστεύσομεν","aor","subj","act","1st","pl"],["πιστεύω","πιστεύσομεν","fut","ind","act","1st","pl"],["πιστεύω","πίστευσον","aor","imperat","act","2nd","sg"],["πιστεύω","πιστεύσουσι","fut","ind","act","3rd","pl"],["πιστεύω","πιστεύσουσιν","aor","subj","act","3rd","pl"],["πιστεύω","πιστεύσουσιν","fut","ind","act","3rd","pl"],["πιστεύω","πιστεύσῃς","aor","subj","act","2nd","sg"],["πιστεύω","πιστεύσω","aor","ind","mid","2nd","sg"],["πιστεύω","πιστεύω","pres","subj","act","1st","sg"],["πιστεύω","πιστεύωμεν","pres","subj","act","1st","pl"]];
const html = pivotTable(data.slice(1), 1, [0, 6, 5], [2, 3, 4]);
//document.querySelector("table").innerHTML = html;


//If your originally data is only available in an HTML table, then first extract the data from that table with code like this:
function fromHtml(table) {
    const results = [];
    for (const row of table.rows) {
        results.push(Array.from(row.cells, cell => cell.textContent.trim()));
    }
    return results;
}


//You can also choose to have data organised as an array of plain objects:
//[
 //   {lemma: "πιστεύω", form: "πεπίστευκα", tense: "perf", mood: "ind", voice: "act", person: "1st", number "sg"},
  //  {lemma: "πιστεύω", form: "πεπιστεύκαμεν", tense: "perf", mood: "ind", voice: "act", person: "1st", number: "pl"},
    /* ... */
//];
//In that case the call to the function would look like:
//const html = pivotTable(data, "form", ["lemma", "number", "person"], ["tense", "mood", "voice"]);


function ForEach(item, callback)
{
	for(var objEnum= new Enumerator(item); !objEnum.atEnd(); objEnum.moveNext())
		callback(objEnum.item())
}

/* ensures the length, removes the illicit characters */
function MakeFileName(fileName){
	if (fileName.length>150) fileName=fileName.substring(0,150);
		
	illicitFilenameChars.match(/./g).forEach(function (chr) {
		fileName= fileName.split(chr).join('')		
	});
	
	fileName=fileName.trim()
	
	if (!fileName.length) throw("MakeFileName: no characters in file name");
	return fileName;
}

function ReadUTF8File(path)
{
	var s = new ActiveXObject("adodb.stream");
	s.Type = adTypeText;
	s.Charset="UTF-8";
	s.Open();
	s.LoadFromFile (path);
	text = s.ReadText();
	s.Close();
	return text;
}

function WriteUTF8File(path, contents)
{
	var s = new ActiveXObject("adodb.stream");
	s.Type = adTypeText;
	s.Charset="UTF-8";
	s.Open();
	s.WriteText(contents);
	s.SaveToFile(path, adSaveCreateOverWrite);
	s.Close();
}



function recordset2json(rs)
{
	var js=[];

	if (rs.BOF)
		return {};
	
	rs.MoveFirst;
	while (!rs.EOF)
	{	
		var rec={};
		var e=new Enumerator(rs.Fields);
		for (;!e.atEnd();e.moveNext())         
      	{
      		field=e.item();
			rec[field.Name]=String(field.Value).trim();
		}
		
		js.push(rec);
		rs.MoveNext
	}
		
	return js;
}


//If typeof arg not string - problem.

function CreateHTMLElement(tag) {
	var args = Array.prototype.slice.call(arguments, 1);
  	
	var el=document.createElement (tag);
	var attr='';

	//echo(tag, args.join(' '));  	

	for (arg in args) {
		//echo ("Iteratio", arg);
		arg=args[arg];
		if (typeof arg == "undefined") continue;
		else if (Array.isArray(arg))
			arg.forEach(function(child) {el.appendChild(child);});
		
		else if (typeof arg == "object") 
			el.appendChild (arg);
		
		else if(attr.length) {
			el.setAttribute(attr, arg);
			attr='';	
		} else
			attr=arg;
		
	}
	if (attr.length) el.innerHTML=attr;

	return el;
}

function htmla(addr){
	return CreateHTMLElement("a", "href", addr)
}

function Sleep(ms)
{
	ms += new Date().getTime();
	while (new Date() < ms){}
 
}

function echo () {
	var text;
	var args = Array.prototype.slice.call(arguments, 0);
  	text = args.join(' ');
  	
  	var p=document.createElement ('p');
  	p.innerText = text;
  	p.style.width="100%"
  	p.style.overflow ="visible";

	if (document.body) {
		document.body.appendChild (p);
		window.scrollTo (0, document.body.scrollHeight);
	} //else
	//	alert ("Document body not yet available. Message: " + text);

}

function echohtml(code) {
	var text;
	var args = Array.prototype.slice.call(arguments, 0);
  	text = args.join(' ');
  	
  	var p=document.createElement ('span');
  	p.innerHTML = text;
  	p.style.width="100%"
  	p.style.overflow ="visible";
	document.body.appendChild (p);

	window.scrollTo (0, document.body.scrollHeight);
}

function WriteFile(fileName, text){
	var f=fso.CreateTextFile(fileName, true, true);
	f.Write(text);
	f.Close()
}

function ReadFile(fileName){
	return fso.OpenTextFile(fileName, ForReading, false, TristateTrue).ReadAll();
}

function GetDate(str){
	if (arguments.length)
		return new Date(str);
	else
		return new Date();
}



function GetClickedWord(s) {
	
    var range = s.getRangeAt(0);
    var node = s.anchorNode;
    
    return (range.toString().trim())
    
    /*
	while (range.startOffset !== 0) {                   // start of node
		range.setStart(node, range.startOffset - 1)     // back up 1 char
		if (range.toString().search(/\s/) === 0) {      // space character
		    range.setStart(node, range.startOffset + 1);// move forward 1 char
		    break;
		}
	}
	while (range.endOffset < node.length) {         // end of node
	    range.setEnd(node, range.endOffset + 1)     // forward 1 char
	    if (range.toString().search(/\s/) !== -1) { // space character
	        range.setEnd(node, range.endOffset - 1);// back 1 char
	        break;
	    }
	}
    return range.toString().trim();
   */
}


// string functions 
function format() {
	var args = Array.prototype.slice.call(arguments, 0);
  	return args.join('');
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function SeriesReplace(text, patches)
{
	patches.forEach(function(r) {
		text=text.replace(r[0], r[1]);
	});
	return text;
}

function nl2br (str, is_xhtml) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Philip Peterson
  // +   improved by: Onno Marsman
  // +   improved by: Atli Þór
  // +   bugfixed by: Onno Marsman
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Maximusya
  // *     example 1: nl2br('Kevin\nvan\nZonneveld');
  // *     returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
  // *     example 2: nl2br("\nOne\nTwo\n\nThree\n", false);
  // *     returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
  // *     example 3: nl2br("\nOne\nTwo\n\nThree\n", true);
  // *     returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'
  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}


function htmlentities(rawStr)
{
	return rawStr.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
	   return '&#'+i.charCodeAt(0)+';';
	});
}

function RemoveSetting(setting, key)
{
	var settings, searchFor;
	
	if (setting.length==0) return;
	
	if (typeof key=="undefined")
		searchFor=["^(Set )?"+setting + "(\\(.*?\\))?=[^\r\n]+$"];	
	else if (eval(setting+".Exists('"+key+"')"))
		//alert("setting found");
		searchFor=["^"+setting + '\\("'+key+'"\\)=' + "[^\r\n]+$"];
	else
		return;
			
	var fsoSettings=fso.OpenTextFile(settingsFile, ForReading, false, TristateTrue);
	settings=fsoSettings.ReadAll();
	fsoSettings.Close();	

	for (var i in searchFor)
		//alert(searchFor[i]);
		settings=settings.replace(new RegExp(searchFor[i], "gim"), '');
	
	var fsoSettings=fso.OpenTextFile(settingsFile, ForWriting, false, TristateTrue)
	fsoSettings.Write (settings);
	fsoSettings.Close()
}

