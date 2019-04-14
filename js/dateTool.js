(function(_){
    var numReg=/\d+/g;
    var months=[31,28,31,30,31,30,31,31,30,31,30,31];
    var months2=[31,29,31,30,31,30,31,31,30,31,30,31];
    var week_china=["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];
	var now=new Date();
    var tool=function(){
        return new tool.fn.init();
    };
    tool.fn=tool.prototype={
        init:function(){

        },
        isleap:function(yy){
            var mrun=(yy%100==0&&yy%400==0)||(yy%100!=0&&yy%4==0)?true:false;
            return mrun;
        },
        stringToDt:function(str){
            if(str instanceof Date){
                return str;
            }
            var numarr=[];
            var num;
            while((num=numReg.exec(str))!=null){
                numarr.push(num[0]);
            }
			
            var dtarr=[now.getFullYear(),now.getMonth()+1,now.getDate()];
            for(var i=0;i<numarr.length;i++){
                if(i>=3){break;}
                dtarr[i]=numarr[i];
            }
            return new Date(dtarr[0],(dtarr[1]-1),dtarr[2]);
        },
        reduceDays:function(dt,year,num){
            if(typeof num=='string'){
                num=parseInt(num,'10');
            }
            var dt=dt instanceof Date?dt:this.stringToDt(dt);
            var yy=dt.getFullYear(),
                mm=dt.getMonth(),
                dd=dt.getDate();
            if(year=='year'){
                yy-=num;
                var mon=this.isleap(yy)?months2:months;
                if(mon[mm]<dd){
                    dd=mon[mm];
                }
            }
            if(year=='month'){
                mm-=num;
                while(mm<0){
                    mm+=12;
                    yy-=1;
                }
                var mon=this.isleap(yy)?months2:months;
                if(mon[mm]<dd){
                    dd=mon[mm];
                }
            }
            if(year=='day'){
                dd-=num;
                var mon=this.isleap(yy)?months2:months;
                while(dd<0){
                    dd+=mon[mm-1];
                    mm-=1;
                    if(mm<0){
                        mm=11;
                        yy-=1;
                        mon=this.isleap(yy)?months2:months;
                    }
                }
            }
            return new Date(yy,mm,dd);
        },
        addDays:function(dt,year,num){
            if(typeof num == 'string'){
                num=parseInt(num,'10');
            }
            var dt=dt instanceof Date?dt:this.stringToDt(dt);
            var yy=dt.getFullYear(),
                mm=dt.getMonth(),
                dd=dt.getDate();
            if(year=='year'){
                yy+=num;
                var mon=this.isleap(yy)?months2:months;
                if(mon[mm]<dd){
                    dd=mon[mm];
                }
            }
            if(year=='month'){
                mm+=num;
                while(mm>11){
                    mm-=12;
                    yy+=1;
                }
                var mon=this.isleap(yy)?months2:months;
                if(mon[mm]<dd){
                    dd=mon[mm];
                }

            }
            if(year=='day'){
                dd+=num;
                var mon=this.isleap(yy)?months2:months;
                while(dd>mon[mm]){
                    dd-=mon[mm];
                    mm+=1;
                    if(mm>11){
                        mm=0;
                        yy+=1;
                        mon=this.isleap(yy)?months2:months;
                    }
                }
            }
            return new Date(yy,mm,dd);
        },
        howDaysInTwoDate:function(sdt,edt){
            var sdate=sdt instanceof Date?sdt:this.stringToDt(sdt);
            var edate=edt instanceof Date?edt:this.stringToDt(edt);
            var syy=sdate.getFullYear();
            var smm=sdate.getMonth();
            var sdd=sdate.getDate();

            var eyy=edate.getFullYear();
            var emm=edate.getMonth();
            var edd=edate.getDate();

            var count=0;

            for(var i=syy;i<eyy;i++){
                var leap=this.isleap(i);
                if(leap){
                    count+=366;
                }else{
                    count+=365;
                }
            }

            var ismax=smm>emm?true:false;
            var k=ismax?emm:smm;
            var len=ismax?smm:emm;
           
            var mleap=this.isleap(eyy);
            var mons=mleap?months2:months;
 
            var mcount=0;
            
            for(;k<len;k++){
                mcount+=mons[k];
            }
           
            var dcount=edd-sdd;

            var tcount=count+(ismax?-mcount:mcount)+dcount;
            return tcount;
        },
        deconstruction_date:function(sdate,edate,needstr,fmt){
            var sdt=sdate instanceof Date?sdate:this.stringToDt(sdate);
            var edt=edate instanceof Date?edate:this.stringToDt(edate);
            var arr=[];
            var daynums=this.howDaysInTwoDate(sdt, edt);
            var tmpdt=this.stringToDt(sdt);
            for(var i=0;i<daynums+1;i++){
                var ndate=this.addDays(tmpdt,"day",i);
                needstr?arr.push(this.DtToString(ndate,fmt)):arr.push(ndate);
            }
            return arr;
        },
        deconstructDW:function(sdate,edate,fmt){
            var sdt=sdate instanceof Date?sdate:this.stringToDt(sdate);
            var edt=edate instanceof Date?edate:this.stringToDt(edate);
            var arr=[];
            var daynums=this.howDaysInTwoDate(sdt, edt);
            var tmpdt=this.stringToDt(sdt);
            for(var i=0;i<daynums+1;i++){
                var ndate=this.addDays(tmpdt,"day",i);
                //needstr?arr.push(this.DtToString(ndate)):arr.push(ndate);
                var wk=this.getWeek(ndate);
                arr.push({weeknum:wk,week:week_china[wk],date:this.DtToString(ndate,fmt)});
            }
            return arr;
        },
        DtToString:function(date,fmt){
            var year=date.getFullYear();
            var month=date.getMonth();
            var day=date.getDate();
			var fmt=fmt||"yyyy-MM-dd";
			fmt=fmt.replace(/yyyy/,year);
			fmt=fmt.replace(/yy|y/,(year+"").substring(2));
			fmt=fmt.replace(/MM/,this.formatDouble((month+1)));
			fmt=fmt.replace(/dd/,this.formatDouble(day))
            fmt=fmt.replace(/M/,(month+1));
            fmt=fmt.replace(/d/,day);
            return fmt;
        },
        getWeek:function(date){
            var wk=date.getDay();
            return wk;
        },
        formatDouble:function(mm){
            if(mm>=10){
                return mm;
            }
            return "0"+mm;
        }
    };
    tool.fn.init.prototype=tool.fn;
    var dateTool=tool();
    window.dateTool=dateTool;
}(window));