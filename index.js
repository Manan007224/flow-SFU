const bookings = [];
//saving all the classroms in a hash 
const class_campus = {
	"Burnaby": ["AQ", "AAB", "ASB", "BLU", "BEE", "CCC", "DAC", "DH", "DIS1", "DIS2", "EDB", "FM", "GH", 
				"HC", "LDC", "MBC", "RCB", "RBC", "SWH", "SCB", "SCC", "SCK", "SCP", "SECB", "SSB", "SRA", "SH", 
				"SHA", "T3", "TASC 1", "TASC 2", "TC", "TH", "LIB", "WMC", "WTB", "C900", "B9", "P9", "K9"],
    "Surrey":  ["SUR"],
    "Vancouver": ["HCC"],
};

const campus_colors = {
	"BUR": "rgb(0, 153, 51)",
	"SUR": "rgb(255, 153, 0)",
	"HCC": "rgb(255, 153, 0)"
};

const DAYS = {
		"M" : "2018-03-12",
		"Tu": "2018-03-13",
		"W": "2018-03-14",
		"Th": "2018-03-15",
		"F": "2018-03-16"
};

const classes = JSON.parse(data);
var classes_toDsiplay = [];

classes.forEach(function(course){
	CLASS_DAYS = []
	course.days.forEach(function(element) {
		CLASS_DAYS.push(match_week_days(element));
	});
	item = {
			'title': course.name,
			'name' : course.name,
			'days' : CLASS_DAYS,
			'time_start' : parse_time(course.time).time_start,
			'time_end': parse_time(course.time).time_end,
			'rooms': course.location,
			'campus': get_campus_name(course.location)
	};
	classes_toDsiplay.push(item);
});
//declaring all the helper methods we need for later use

//function takes the time as an input and parses it as deafult *24Hr time.
function parse_time(tm) {
	//covering all the three cases that we need for the time formatting
	strt = []; edn = []; start_time = []; end_time = [];
	if(tm.length == 6){ 
		strt = [tm[0], tm[3]]; 
		edn = [tm[2], tm[5]];
	}
	if(tm.length == 9){
		strt = [tm[0], tm[3], tm[6]]; 
		edn = [tm[2], tm[5], tm[8]]; 
	}
	if(tm.length == 3){
		strt = [tm[0]]; 
		edn = [tm[3]]; 
	}
	strt.forEach(function(element){
		start_time.push(moment(element, "HH:mmA").format("HH:mm:ss"));
	});
	edn.forEach(function(element){
		end_time.push(moment(element, "HH:mmA").format("HH:mm:ss"));
	});
	return {
		time_start: start_time,
		time_end: end_time
	};
}

classes_toDsiplay.forEach(function(element){
		let campus = element.campus;
		let color = campus_colors[campus];
		for(let i=0; i<element.rooms.length; i++) {
			var startT = element.days[i]+"T"+element.time_start[i];
			var endT = element.days[i]+"T"+element.time_end[i];
			var schedule = new Object();
			schedule.start = startT;
			schedule.end = endT;
			schedule.title = element.title;
			schedule.backgroundColor =  "#f77";
			bookings.push(schedule);
		}
});

$(document).ready(function() {
$('#calendar').fullCalendar({
		defaultView: 'agendaWeek',
		allDaySlot: false,
		height: 'auto',
		allDaySlot: false,
		minTime: "07:00:00",
		maxTime: "21:30:00",
		slotDuration: "01:00:00",
    	allDayText: 'TBA',
		weekends: false,
		columnFormat: {
     	 	week: 'ddd',
    	},
    	// scrollTime: "07:00:00",
		defaultDate: "2018-03-12",
		header: {
			left: ' ',
			center: ' ',
			right: ' '
		},
		editable: false,
		 events: bookings
	});
		
});


console.log(bookings);


 //$('#calendar').fullCalendar('addEventSource', bookings, true);
//mapped all the days according to their dates
//*CUURENT plan is to just keep the normal schedule, but will try in the future and add next week option
//for more productivity


function match_week_days(days_arr) {
	return DAYS[days_arr];
}

function get_campus_name(cmp) {
	if(cmp[0] == "SUR") return "SUR";
	else if(cmp[0] == "HCC") return "HCC";
	else return "BUR";
}

function get_campus_color(cmp) {
   	return campus_colors[cmp];
}
