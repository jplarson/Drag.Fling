<%
'=======================================================================
' default.asp
' jpl 06/02/10
'	
'	Demo page for Drag.Fling
'
'	
'=======================================================================
	
	Call DisplayPage()
	Response.End


Function DisplayPage()
	
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <link rel="SHORTCUT ICON" HREF="images/favicon.ico" type="image/ico">
  <title>MooTools Drag.Fling Demo</title>
  <meta name="description" content="">
  <meta name="keywords" content="">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <link href="css/public.css" media="screen" rel="Stylesheet" type="text/css" />
  
  <script type="text/javascript" src="scripts/mootools-1.2.4-core.js"></script>
  <script type="text/javascript" src="scripts/mootools-1.2.4-more-Drag.js"></script>
  <script type="text/javascript" src="scripts/Drag.Fling.js"></script>
</head>
<body>
<div class="mainWindow">
  <div class="viewPort" id="viewPort">
<%
	Dim pCount
	for pCount = 1 to 8
%>    <div class="page"><div class="inner"><h2>Page <%=pCount%></h2><div class="pageContent">Content for page <%=pCount%>.</div></div></div>
<%	
	next
%>
  </div><!--viewPort-->
</div><!--mainWindow-->
<script type="text/javascript">
	window.addEvent('domready', function() {
		new Drag.Fling('viewPort', { flingAxis: 'x'});
	});
</script>
</body>
</html>
<%
End Function
%>