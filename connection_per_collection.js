// script to find the number of connection per collections and maxRunning seconds
var tempArr= [],tempObj = {}; db.currentOp(true).inprog.forEach( function(item) {
	if (tempArr.indexOf(item.ns) >=0 )
		{
		tempObj[item.ns]['numRunning']++;
			if (item.secs_running > tempObj[item.ns]['maxRunning'])
				{
					tempObj[item.ns]['maxRunning']=item.secs_running;
				}
		}
	else
		{
		tempObj[item.ns]={ "numRunning":1, "maxRunning": item.secs_running }
		tempArr.push(item.ns);
		}
	}
);printjson(tempObj);
