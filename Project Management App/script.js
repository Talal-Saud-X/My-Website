const obj = {
	personalisation: document.getElementById('day'),
	alertTitle: document.getElementById('alertTitle'),
	alertDialog: document.getElementById('alertDialog'),
	closeModal: document.getElementById('closeModal'),
	reportTitle: document.getElementById('reportTitle'),
	reportDialog: document.getElementById('reportDialog'),
	reportInfo: document.getElementById('reportInfo'),
	reportCloseModal: document.getElementById('reportCloseModal'),
	form: document.getElementById('project-form'),
	input: document.getElementById('project-input'),
	search_input: document.getElementById("projects_search"),
	projects_element: document.getElementById('projects'),
	projects_temp: document.getElementById('projects-temp'),
	tasks_temp: document.getElementById('tasks-temp'),
	arrayOfProjects: []
}

obj.closeModal.addEventListener("click", () => { obj.alertDialog.close() })
obj.reportCloseModal.addEventListener("click", () => { obj.reportDialog.close() })
obj.form.addEventListener("submit", addProjects)
obj.input.addEventListener("input", restrictInput);
obj.search_input.addEventListener("input", projectSearch)

personalisation()
getProjects()

function personalisation() {
	switch (new Date().getDay()) {
		case 0:
			obj.date1 = "Sunday";
			break;
		case 1:
			obj.date1 = "Monday";
			break;
		case 2:
			obj.date1 = "Tuesday";
			break;
		case 3:
			obj.date1 = "Wednesday";
			break;
		case 4:
			obj.date1 = "Thursday";
			break;
		case 5:
			obj.date1 = "Friday";
			break;
		case 6:
			obj.date1 = "Saturday";
			break;
		default:
			obj.date1 = 'Day';
			break;
	}
	obj.personalisation.textContent += `${obj.date1}!`;
	return
}

function getProjects() {
	if (localStorage.getItem("project")) {
		obj.arrayOfProjects = JSON.parse(localStorage.getItem("project"))
		const is_fromLocalStorage = true
		addProjectsToPage(is_fromLocalStorage)
	}
	return
}

function addProjects(e) {
	e.preventDefault();

	if (!obj.input.value.trim()) {
		obj.alertTitle.textContent = "Please Enter a Project Name.";
		obj.alertDialog.showModal();
		return
	}

	// Add project To Array Of Projects
	const title = obj.input.value.trim();
	const result = obj.arrayOfProjects.find(projectTitle => projectTitle.project_title.toLowerCase() === title.toLowerCase());

	if (result) {
		obj.alertTitle.textContent = `(${title}) Project is Already Exist!`;
		obj.alertDialog.showModal()
		obj.input.value = "";
		return
	}
	// project Data
	const project = {
		id: (Date.now()).toString(),
		project_title: title,
		tasks: []
	};
	// Push project To Array Of projects
	obj.arrayOfProjects.push(project);
	// Add project To Page
	createNewProjectElement(project);
	// Update Local Storage
	updateLocalStorage();
	obj.input.value = '';
	return
};

function createNewProjectElement(project, is_fromLocalStorage = false) {
	const project_element = obj.projects_temp.content.cloneNode(true).children[0]
	const project_name = project_element.querySelector(".project-name")
	const project_edit_btn = project_element.querySelector(".editProject")
	const project_delete_btn = project_element.querySelector(".deleteProject")
	const project_report_btn = project_element.querySelector(".reportProject")
	const task_form = project_element.querySelector(".task-form")
	const task_input = task_form.querySelector(".task-input")
	const task_filter = project_element.querySelector(".task_filter")
	const task_search = project_element.querySelector(".search__input")
	const tasks_element = project_element.querySelector(".tasks")

	project_name.addEventListener("input", restrictInput);
	project_name.value = project.project_title
	task_input.addEventListener("input", restrictInput);
	task_input.placeholder = `What are you going to do for (${project.project_title}) Project?`;

	project_edit_btn.addEventListener('click', () => {
		if (project_edit_btn.textContent == "Edit Project") {
			project_name.removeAttribute('readonly');
			project_name.focus();
			project_edit_btn.textContent = "Save";
			return
		}

		if (!project_name.value.trim()) {
			obj.alertTitle.textContent = "Field Must Not Be Empty!!";
			obj.alertDialog.showModal();
			project_name.value = project.project_title;
			project_name.setAttribute('readonly', '');
			project_edit_btn.textContent = "Edit Project";
			return
		}

		const projectNameEdit = project_name.value.trim();

		const result2 = obj.arrayOfProjects.find(title => title.project_title.toLowerCase() === projectNameEdit.toLowerCase());

		if (result2) {
			obj.alertTitle.textContent = `(${projectNameEdit}) Project is Already Exist!`;
			obj.alertDialog.showModal();
			project_name.value = project.project_title;
			project_name.setAttribute('readonly', '');
			project_edit_btn.textContent = "Edit Project";
			return
		}

		project.project_title = projectNameEdit;
		project_name.value = projectNameEdit;
		project_name.setAttribute('readonly', '');
		project_edit_btn.textContent = "Edit Project";
		task_input.placeholder = `What are You going to do for (${projectNameEdit}) Project?`;
		updateLocalStorage();
		return
	})

	project_delete_btn.addEventListener('click', () => {
		project.tasks.forEach(task => clearInterval(task.timer_log.interval));
		obj.arrayOfProjects = obj.arrayOfProjects.filter((projectID) => projectID.id != project.id);
		updateLocalStorage();
		project_element.remove();
		return
	})

	project_report_btn.addEventListener('click', () => {
		let nStarted = 0
		let nStopped = 0
		let nCompleted = 0

		project.tasks.forEach(task => {

			if (task.start_log.started == 'true') { nStarted++ }
			if (task.stop_log.stopped == 'true' && task.complete_log.completed != 'true') { nStopped++ }
			if (task.complete_log.completed == 'true') { nCompleted++ }
		})

		obj.reportTitle.textContent = `Report for (${project.project_title}) Project`;
		obj.reportInfo.textContent = `Number Of Tasks (Total): ${project.tasks.length}\n
			Number Of Tasks (Running): ${nStarted}\n
			Number Of Tasks (Stopped): ${nStopped}\n
			Number Of Tasks (Completed): ${nCompleted}`;
		obj.reportDialog.showModal();

		nStarted = 0;
		nStopped = 0;
		nCompleted = 0;
		return
	})

	task_form.addEventListener('submit', (e) => {

		e.preventDefault();

		if (!task_input.value.trim()) {
			obj.alertTitle.textContent = "Please Enter a Task Name.";
			obj.alertDialog.showModal();
			return
		}

		// Add Task To Array Of Tasks
		const title = task_input.value.trim();
		const result = project.tasks.find(taskTitle => taskTitle.details_log.task_title.toLowerCase() === title.toLowerCase());

		if (result) {
			obj.alertTitle.textContent = `(${title}) Task is Already Exist!`;
			obj.alertDialog.showModal();
			task_input.value = '';
			return
		}
		var hours = new Date().getHours();
		var minutes = new Date().getMinutes();
		hours = hours % 12;
		hours = hours ? hours : '12';
		minutes = (minutes < 10) ? `0${minutes}` : minutes;
		// Task Data
		const task = {
			details_log: {
				id: (Date.now()).toString(),
				task_title: title,
				create_date: (new Date()).toLocaleDateString(),
				create_day: obj.date1,
				create_hour: (hours).toString(),
				create_minutes: (minutes).toString(),
				am_or_pm: hours >= 12 ? 'PM' : 'AM'
			},
			start_log: {
				started: "false",
				isStarted_before: "false",
			},
			stop_log: {
				stopped: "false",
				isStopped_before: "false",
			},
			complete_log: {
				completed: "false",
			},
			timer_log: {
				hours: "00",
				minutes: "00",
				seconds: "00",
				seconds_elapsed: 0,
				elapsedDays: "0 Day",
				reset_count: 0
			}
		};
		// Push Task To Array Of Tasks
		project.tasks.push(task);
		// Add Task To Page
		createNewTaskElement(tasks_element, project, task);
		// Update Local Storage
		updateLocalStorage();
		task_input.value = '';
		return
	})

	task_filter.addEventListener("change", (e) => {
		const task_list = tasks_element.childNodes;
		const value = e.target.value

		task_list.forEach(list => {
			const isVisible = list.classList.contains(value) || value == 'all'
			list.classList.toggle("hide", !isVisible)
		})
	})

	task_search.addEventListener("input", (e) => {
		task_filter.value = "all"
		const tasks = tasks_element.childNodes
		restrictInput(e)

		searchFunc(tasks, e.target.value, false);
	})

	if (is_fromLocalStorage) {
		addTasksToPage(tasks_element, project);
	}
	obj.projects_element.append(project_element)

	return;
}

function addProjectsToPage(is_fromLocalStorage) {
	obj.arrayOfProjects.forEach((project) => {
		createNewProjectElement(project, is_fromLocalStorage)
	});
	return;
};

function createNewTaskElement(tasks_element, project, task) {
	const task_element = obj.tasks_temp.content.cloneNode(true).children[0]
	const taskStatus = task_element.querySelector(".taskStatus")
	const task_name = task_element.querySelector(".task-name")
	task_name.value = task.details_log.task_title
	const time_el = task_element.querySelector(".time")
	const start_btn = task_element.querySelector(".start")
	const complete_btn = task_element.querySelector(".complete")
	const reset_btn = task_element.querySelector(".reset")
	const report_btn = task_element.querySelector(".report")
	const edit_btn = task_element.querySelector(".edit")
	const delete_btn = task_element.querySelector(".delete")

	if (task.start_log.started == "true") {
		task_element.className = "task started";
		start_btn.textContent = 'Stop';
		taskStatus.textContent = `Status: Started, ${task.start_log.day}, ${task.start_log.start_date}, ${task.start_log.hours}:${task.start_log.minutes} ${task.start_log.ampm}`;
		timer()
	}
	task.start_log.started == "false" ? time_el.textContent = `${task.timer_log.hours}:${task.timer_log.minutes}:${task.timer_log.seconds}` : task.timer_log.interval = (setInterval(timer, 1000)).toString();

	if (task.start_log.isStarted_before == "false") {
		taskStatus.textContent = "Status: Not Started yet";
	}

	if (task.stop_log.stopped == "true") {
		task_element.className = "task stopped";
		taskStatus.textContent = `Status: Stopped, ${task.stop_log.day}, ${task.stop_log.stop_date}, ${task.stop_log.hours}:${task.stop_log.minutes} ${task.stop_log.ampm}`;
	}

	if (task.complete_log.completed == "true") {
		task_element.className = "task completed";
		taskStatus.textContent = "Status: Completed";
	}

	task_name.addEventListener("input", restrictInput);

	start_btn.addEventListener('click', () => {

		if (start_btn.textContent == 'Start') {
			task_element.className = "task started";
			if (task.start_log.isStarted_before == "false") {
				task.timer_log.startTime = new Date().getTime()
			} else {
				task.timer_log.startTime = new Date().getTime() - (task.timer_log.seconds_elapsed * 1000)
			}
			start_btn.textContent = 'Stop';
			task.start_log.start_date = (new Date()).toLocaleDateString();
			task.start_log.day = obj.date1;
			task.start_log.hours = new Date().getHours();
			task.start_log.ampm = task.start_log.hours >= 12 ? 'PM' : 'AM';
			task.start_log.hours = task.start_log.hours % 12;
			task.start_log.hours = task.start_log.hours ? (task.start_log.hours).toString() : '12';
			task.start_log.minutes = new Date().getMinutes();
			task.start_log.minutes = (task.start_log.minutes < 10) ? `0${task.start_log.minutes}` : (task.start_log.minutes).toString();
			task.start_log.started = "true";
			task.stop_log.stopped = "false";
			task.complete_log.completed = "false";
			delete task.complete_log.day
			delete task.complete_log.complete_date
			delete task.complete_log.hours
			delete task.complete_log.minutes
			delete task.complete_log.ampm
			task.start_log.isStarted_before = "true";
			taskStatus.textContent = `Status: Started, ${task.start_log.day}, ${task.start_log.start_date}, ${task.start_log.hours}:${task.start_log.minutes} ${task.start_log.ampm}`;
			task.timer_log.interval = (setInterval(timer, 1000)).toString();
			updateLocalStorage();
			return
		}
		clearInterval(task.timer_log.interval);
		task_element.className = "task stopped";
		task.complete_log.completed = "false";
		task.start_log.started = "false";
		task.stop_log.stopped = "true";
		task.stop_log.isStopped_before = "true";
		task.stop_log.stop_date = (new Date()).toLocaleDateString();
		task.stop_log.day = obj.date1;
		task.stop_log.hours = new Date().getHours();
		task.stop_log.ampm = task.stop_log.hours >= 12 ? 'PM' : 'AM';
		task.stop_log.hours = task.stop_log.hours % 12;
		task.stop_log.hours = task.stop_log.hours ? (task.stop_log.hours).toString() : '12';
		task.stop_log.minutes = new Date().getMinutes();
		task.stop_log.minutes = (task.stop_log.minutes < 10) ? `0${task.stop_log.minutes}` : (task.stop_log.minutes).toString();
		taskStatus.textContent = `Status: Stopped, ${task.stop_log.day}, ${task.stop_log.stop_date}, ${task.stop_log.hours}:${task.stop_log.minutes} ${task.stop_log.ampm}`;
		start_btn.textContent = 'Start';
		updateLocalStorage();
		return
	});

	complete_btn.addEventListener('click', () => {
		if (task.start_log.isStarted_before == "false") {
			obj.alertTitle.textContent = "Please Start Task First!";
			obj.alertDialog.showModal();
			return
		}

		clearInterval(task.timer_log.interval);
		task_element.className = "task completed";
		taskStatus.textContent = "Status: Completed";
		task.complete_log.completed = "true";
		task.start_log.started = "false";
		task.complete_log.complete_date = (new Date()).toLocaleDateString();
		task.complete_log.day = obj.date1;
		task.complete_log.hours = new Date().getHours();
		task.complete_log.ampm = task.complete_log.hours >= 12 ? 'PM' : 'AM';
		task.complete_log.hours = task.complete_log.hours % 12;
		task.complete_log.hours = task.complete_log.hours ? (task.complete_log.hours).toString() : '12';
		task.complete_log.minutes = new Date().getMinutes();
		task.complete_log.minutes = (task.complete_log.minutes < 10) ? `0${task.complete_log.minutes}` : (task.complete_log.minutes).toString();
		start_btn.textContent = 'Start';
		updateLocalStorage();
		return
	});

	reset_btn.addEventListener('click', () => {
		if (task.start_log.isStarted_before == "false") {

			obj.alertTitle.textContent = "Please Start Task First!";
			obj.alertDialog.showModal();
			return
		}
		clearInterval(task.timer_log.interval);
		task_element.className = "task notStarted";
		task.start_log.started = "false"
		task.complete_log.completed = "false"
		task.stop_log.stopped = "false"
		task.start_log.isStarted_before = "false"
		task.stop_log.isStopped_before = "false"
		task.timer_log.seconds_elapsed = 0
		task.timer_log.hours = "00"
		task.timer_log.minutes = "00"
		task.timer_log.seconds = "00"
		delete task.start_log.day
		delete task.timer_log.startTime
		delete task.start_log.start_date
		delete task.start_log.hours
		delete task.start_log.minutes
		delete task.start_log.ampm
		delete task.complete_log.day
		delete task.complete_log.complete_date
		delete task.complete_log.hours
		delete task.complete_log.minutes
		delete task.complete_log.ampm
		delete task.stop_log.day
		delete task.stop_log.stop_date
		delete task.stop_log.hours
		delete task.stop_log.minutes
		delete task.stop_log.ampm
		start_btn.textContent = 'Start';
		time_el.textContent = "00:00:00";
		taskStatus.textContent = "Status: Not Started Yet"
		task.timer_log.reset_count++
		updateLocalStorage();
		return
	});

	report_btn.addEventListener('click', () => {
		obj.elapsedDays = Math.floor((task.timer_log.seconds_elapsed * 1000) / (24 * 3600 * 1000))
		if (obj.elapsedDays > 0) {
			task.timer_log.elapsedDays = obj.elapsedDays > 1 ? `${obj.elapsedDays} Days` : `${obj.elapsedDays} Day`;
		}
		if (task.start_log.isStarted_before == "false") {
			obj.reportTitle.textContent = `Report for (${task.details_log.task_title}) Task`
			obj.reportInfo.textContent = `Belong to: ${project.project_title} Project\n
				Task Title: ${task.details_log.task_title}\n
				Task Created: ${task.details_log.create_day}, ${task.details_log.create_date}, at: ${task.details_log.create_hour}:${task.details_log.create_minutes} ${task.details_log.am_or_pm}\n
				Last Start: Not Started yet\n
				Last Stopped: Not Stopped yet\n
				Task Completed: Not Completed yet\n
				Timer Reset Count: ${task.timer_log.reset_count}\n
				Duration: ${task.timer_log.hours}:${task.timer_log.minutes}:${task.timer_log.seconds}\n
				Duration (Details): ${task.timer_log.elapsedDays}, ${task.timer_log.hours % 24} Hrs, ${+task.timer_log.minutes} Mins, ${+task.timer_log.seconds} Secs`;
			obj.reportDialog.showModal();
			return
		}
		else if (task.start_log.started == "true" && task.stop_log.isStopped_before == "false") {
			obj.reportTitle.textContent = `Report for (${task.details_log.task_title}) Task`
			obj.reportInfo.textContent = `Belong to: ${project.project_title} Project\n
				Task Title: ${task.details_log.task_title}\n
				Task Created: ${task.details_log.create_day}, ${task.details_log.create_date}, at: ${task.details_log.create_hour}:${task.details_log.create_minutes} ${task.details_log.am_or_pm}\n
				Last Start: ${task.start_log.day}, ${task.start_log.start_date}, ${task.start_log.hours}:${task.start_log.minutes} ${task.start_log.ampm}\n
				Last Stop: Not Stopped yet\n
				Task Completed: Not Completed yet\n
				Timer Reset Count: ${task.timer_log.reset_count}\n
				Duration: ${task.timer_log.hours}:${task.timer_log.minutes}:${task.timer_log.seconds}\n
				Duration (Details): ${task.timer_log.elapsedDays}, ${task.timer_log.hours % 24} Hrs, ${+task.timer_log.minutes} Mins, ${+task.timer_log.seconds} Secs`
			obj.reportDialog.showModal();
			return
		}
		else if ((task.start_log.started == "true" || task.stop_log.isStopped_before == "true") && task.complete_log.completed == "false") {

			obj.reportTitle.textContent = `Report for (${task.details_log.task_title}) Task`
			obj.reportInfo.textContent = `Belong to: ${project.project_title} Project\n
				Task Title: ${task.details_log.task_title}\n
				Task Created: ${task.details_log.create_day}, ${task.details_log.create_date}, at: ${task.details_log.create_hour}:${task.details_log.create_minutes} ${task.details_log.am_or_pm}\n
				Last Start: ${task.start_log.day}, ${task.start_log.start_date}, ${task.start_log.hours}:${task.start_log.minutes} ${task.start_log.ampm}\n
				Last Stop: ${task.stop_log.day}, ${task.stop_log.stop_date}, ${task.stop_log.hours}:${task.stop_log.minutes} ${task.stop_log.ampm}\n
				Task Completed: Not Completed yet\n
				Timer Reset Count: ${task.timer_log.reset_count}\n
				Duration: ${task.timer_log.hours}:${task.timer_log.minutes}:${task.timer_log.seconds}\n
				Duration (Details): ${task.timer_log.elapsedDays}, ${task.timer_log.hours % 24} Hrs, ${+task.timer_log.minutes} Mins, ${+task.timer_log.seconds} Secs`
			obj.reportDialog.showModal();
			return
		}
		else if (task.complete_log.completed == "true" && task.stop_log.isStopped_before == "false") {
			obj.reportTitle.textContent = `Report for (${task.details_log.task_title}) Task`
			obj.reportInfo.textContent = `Belong to: ${project.project_title} Project\n
				Task Title: ${task.details_log.task_title}\n
				Task Created: ${task.details_log.create_day}, ${task.details_log.create_date}, at: ${task.details_log.create_hour}:${task.details_log.create_minutes} ${task.details_log.am_or_pm}\n
				Last Start: ${task.start_log.day}, ${task.start_log.start_date}, ${task.start_log.hours}:${task.start_log.minutes} ${task.start_log.ampm}\n
				Last Stop: Not Stopped yet\n
				Task Completed: ${task.complete_log.day}, ${task.complete_log.complete_date}, at: ${task.complete_log.hours}:${task.complete_log.minutes} ${task.complete_log.ampm}\n
				Timer Reset Count: ${task.timer_log.reset_count}\n
				Duration: ${task.timer_log.hours}:${task.timer_log.minutes}:${task.timer_log.seconds}\n
				Duration (Details): ${task.timer_log.elapsedDays}, ${task.timer_log.hours % 24} Hrs, ${+task.timer_log.minutes} Mins, ${+task.timer_log.seconds} Secs`
			obj.reportDialog.showModal();
			return
		}
		else if (task.complete_log.completed == "true") {
			obj.reportTitle.textContent = `Report for (${task.details_log.task_title}) Task`
			obj.reportInfo.textContent = `Belong to: ${project.project_title} Project\n
				Task Title: ${task.details_log.task_title}\n
				Task Created: ${task.details_log.create_day}, ${task.details_log.create_date}, at: ${task.details_log.create_hour}:${task.details_log.create_minutes} ${task.details_log.am_or_pm}\n
				Last Start: ${task.start_log.day}, ${task.start_log.start_date}, ${task.start_log.hours}:${task.start_log.minutes} ${task.start_log.ampm}\n
				Last Stop: ${task.stop_log.day}, ${task.stop_log.stop_date}, ${task.stop_log.hours}:${task.stop_log.minutes} ${task.stop_log.ampm}\n
				Task Completed: ${task.complete_log.day}, ${task.complete_log.complete_date}, at: ${task.complete_log.hours}:${task.complete_log.minutes} ${task.complete_log.ampm}\n
				Timer Reset Count: ${task.timer_log.reset_count}\n
				Duration: ${task.timer_log.hours}:${task.timer_log.minutes}:${task.timer_log.seconds}\n
				Duration (Details): ${task.timer_log.elapsedDays}, ${task.timer_log.hours % 24} Hrs, ${+task.timer_log.minutes} Mins, ${+task.timer_log.seconds} Secs`
			obj.reportDialog.showModal();
			return
		};
	});

	edit_btn.addEventListener('click', () => {
		if (edit_btn.textContent == "Edit Task") {
			task_name.removeAttribute('readonly');
			task_name.focus();
			edit_btn.textContent = "Save";
			return
		}

		if (!task_name.value.trim()) {
			obj.alertTitle.textContent = "Field Must Not Be Empty!!";
			obj.alertDialog.showModal();
			task_name.value = task.details_log.task_title;
			task_name.setAttribute('readonly', '');
			edit_btn.textContent = "Edit Task";
			return
		}

		const taskNameEdit = task_name.value.trim();
		const result = project.tasks.find(title => title.details_log.task_title.toLowerCase() === taskNameEdit.toLowerCase());

		if (result) {
			obj.alertTitle.textContent = `(${taskNameEdit}) Task is Already Exist!`;
			obj.alertDialog.showModal();
			task_name.value = task.details_log.task_title;
			task_name.setAttribute('readonly', '');
			edit_btn.textContent = "Edit Task";
			return
		}
		task.details_log.task_title = taskNameEdit;
		task_name.value = taskNameEdit;
		task_name.setAttribute('readonly', '');
		edit_btn.textContent = "Edit Task";
		updateLocalStorage();
		return
	})

	//delete
	delete_btn.addEventListener('click', () => {
		clearInterval(task.timer_log.interval);
		project.tasks = project.tasks.filter(taskId => taskId.details_log.id != task.details_log.id)
		updateLocalStorage();
		task_element.remove();
		return
	})

	//counter functions
	function timer() {
		task.timer_log.seconds_elapsed = new Date().getTime() - task.timer_log.startTime
		task.timer_log.seconds_elapsed = Math.floor(Math.abs(task.timer_log.seconds_elapsed / 1000))
		task.timer_log.hours = Math.floor(task.timer_log.seconds_elapsed / 3600);
		task.timer_log.minutes = Math.floor((task.timer_log.seconds_elapsed - (task.timer_log.hours * 3600)) / 60);
		task.timer_log.seconds = task.timer_log.seconds_elapsed % 60;

		task.timer_log.seconds = (task.timer_log.seconds < 10) ? `0${task.timer_log.seconds}` : (task.timer_log.seconds).toString();
		task.timer_log.minutes = (task.timer_log.minutes < 10) ? `0${task.timer_log.minutes}` : (task.timer_log.minutes).toString();
		task.timer_log.hours = (task.timer_log.hours < 10) ? `0${task.timer_log.hours}` : (task.timer_log.hours).toString();

		time_el.textContent = `${task.timer_log.hours}:${task.timer_log.minutes}:${task.timer_log.seconds}`;
	}
	tasks_element.append(task_element)

	return;
}

function addTasksToPage(tasks_element, project) {
	project.tasks.forEach((task) => {
		createNewTaskElement(tasks_element, project, task)
	})
	return;
};

function projectSearch(e) {
	const projects = obj.projects_element.childNodes
	restrictInput(e)

	searchFunc(projects, e.target.value, true);
	return
}

function searchFunc(lists, targetValue, isProject) {
	let isVisible
	lists.forEach(list => {
		if (isProject) {
			isVisible = list.children[0].children[0].children[1].value.toLowerCase().includes(targetValue.toLowerCase()) || targetValue == ''
		} else {
			isVisible = list.children[0].children[1].children[1].value.toLowerCase().includes(targetValue.toLowerCase()) || targetValue == ''
		}
		list.classList.toggle("hide", !isVisible)
	})
	return
};

function restrictInput(e) {

	let newValue = e.target.value.replace(/\s+/gim, ' ');
	newValue = newValue.replace(/[\~\`\#\$\%\^\*\(\)\=\'\"\:\;\>\<\\\[\]\{\}\_\/\u0600-\u06FF\u00A0-\u00FF]/gim, '');
	newValue = newValue.replace(/^\s+/gim, '');
	e.target.value = newValue;
	return
};

function updateLocalStorage() {
	localStorage.setItem("project", JSON.stringify(obj.arrayOfProjects));
	return;
};