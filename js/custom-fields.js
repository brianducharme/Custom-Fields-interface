var target = '#data';
var customFields = {
	data: {
		1: {
			enabled: true,
			fieldName: 'COMPANYCODE',
			prettyName: 'Company Name',
			fieldType: 'OEM',
			fieldValue: ''
		},
		2: {
			enabled: true,
			fieldName: 'CLIENTID',
			prettyName: 'Client ID',
			fieldType: 'OEM',
			fieldValue: ''
		},
		3: {
			enabled: false,
			fieldName: '',
			prettyName: '',
			fieldType: '',
			fieldValue: ''
		},
		4: {
			enabled: false,
			fieldName: '',
			prettyName: '',
			fieldType: '',
			fieldValue: ''
		},
		5: {
			enabled: false,
			fieldName: '',
			prettyName: '',
			fieldType: '',
			fieldValue: ''
		},
		6: {
			enabled: false,
			fieldName: '',
			prettyName: '',
			fieldType: '',
			fieldValue: ''
		},
		7: {
			enabled: false,
			fieldName: '',
			prettyName: '',
			fieldType: '',
			fieldValue: ''
		},
		8: {
			enabled: false,
			fieldName: '',
			prettyName: '',
			fieldType: '',
			fieldValue: ''
		},
		9: {
			enabled: false,
			fieldName: '',
			prettyName: '',
			fieldType: '',
			fieldValue: ''	
		}
	},
	xref: { // Key ['Label','column width',0|1] 1=admin only
		custom: ['#', '10%',0],
		actions: ['Actions', '5%',1],
		enabled: ['Enabled','5%',0],
		fieldName: ['Field', '20%',0],
		prettyName: ['Pretty Name','20%',0],
		fieldType: ['Type','30%',0],
		fieldValue: ['Value','10%',0]
	},
	fieldTypes: [
		[' ',' '],
		['ENV','Environment (ENV)'],
		['REG','Registry (REG)'],
		['WMI','Windows Management Inst. (WMI)'],
		['OEM','Original Equipment Manuf.(OEM)']
	],
	mode: {
		row1: 'view',
		row2: 'view',
		row3: 'view',
		row4: 'view',
		row5: 'view',
		row6: 'view',
		row7: 'view',
		row8: 'view',
		row9: 'view',
	},
	multiedit: false,
	admin: true
}

function getCustomFields(id) {
	if(id) { // return requested array id
		var data = customFields.data[id];
	} else { // return all
		var data = customFields.data;
	}
	console.log(data);
	return data;
}
function replaceSpecialChar(string) {
	if(string) {
		var newString = string.replace(/ /g,'_'); // convert spaces to underscores
		newString = newString.replace(/^_+|_+$/g,''); // remove leading & trailing underscores
		newString = newString.trim();
		newString = newString.replace(/[^a-zA-Z0-9_+ ]/ig, ''); // remove special characters
		newString = newString.replace(/_+/g,'_'); // converts multiple underscores to single
		return newString.toUpperCase();
	}
}
function getTableHeaders() {
	var headers = customFields.xref;
	return headers;
}
function buildFieldTypeSelect(selected,id) {
	var t = customFields.fieldTypes;
	var options = '';
	var limit = t.length;
	if(id > 2) { // limit OEM to Custom 1 & 2 only
		limit = limit - 1;
	}
	for(i=0;i<limit; i++) {
		if(t[i][0] == selected) {
			options += '<option value="' + t[i][0] + '" selected>' + t[i][1] + '</option>'
		} else {
			options += '<option value="' + t[i][0] + '">' + t[i][1] + '</option>'
		}
	}
	return options;
}
function buildTable(target) {
	clearTable(target);
	var data = getCustomFields(); // returns array
	var header = getTableHeaders();
	var hdata = '';
	var rdata = '';
	hdata += '<thead>\n<tr>';
	for(key in header) {
		if(!customFields.admin && header[key][2] == 1) {
			delete header[key];
		} else {
			hdata += '<th width="' + header[key][1] + '">' + header[key][0] + '</th>'
		}
	}
	hdata += '</tr>\n</thead>'
	$(target).append(hdata);
	rdata += '<tbody>';
	for(key in data) {
		rdata +=('<tr data-id="' + key + '">');
		rdata +=('<td><span>Custom ' + key + ':</span></td>');
		if(customFields.admin) {
			rdata += '<td class="text-center"><button class="btn btn-xs btn-info" data-edit="' + key + '"><span class="fa fa-pencil"></span></button><button class="btn btn-xs btn-success" style="display:none;" data-save="' + key + '"><span class="fa fa-floppy-o"></span></button><button class="btn btn-xs btn-danger" style="display:none;" data-cancel="' + key + '"><span class="fa fa-ban"></span></button></td>';
		}
		for(subkey in data[key]) {
			switch(subkey) {
				case 'enabled':
					var checked = '';
					if(data[key][subkey] == true) {
						var checked = 'checked';
					}
					rdata += '<td class="text-center"><input type="checkbox" data-field="enabled" disabled '+ checked + ' /></td>';
					break;
				case 'fieldType':
					var fieldTypeName = '';
					var fieldTypeVal = '';
					$.each(customFields.fieldTypes, function(i, l) {
						if(l[0] == data[key][subkey]) {
							fieldTypeName = customFields.fieldTypes[i][1];
							fieldTypeVal = customFields.fieldTypes[i][0];
						}
					})
					rdata += '<td><span class="field" data-field="' + subkey + '">' + fieldTypeName + '</span><select class="form-control input-sm" data-field="' + subkey + '" style="display:none;">';
					var options = buildFieldTypeSelect(data[key][subkey],key);
					rdata += options + '</select></td>';
					break;
				default:
					rdata += '<td><span class="field" data-field="' + subkey + '">' + data[key][subkey] + '</span><input type="text" class="form-control input-sm" data-field="' + subkey + '" value="' + data[key][subkey] + '" style="display:none;" /></td>';
			}
		}
		rdata += '</tr>';
	}
	rdata +=('</tbody>');
	$(target).append(rdata);
	
	initializeButtons();
}
function clearTable(target) {
	$(target).empty();
}
function resetForm(target) {
	var currentID = $(target + ' tfoot tr').data('id');
	var newID = parseInt(currentID) + 1;
	$(target + ' tfoot tr').attr('data-id', newID);
}
function checkForDisabled(id) {
	var value = $(target + ' tr[data-id="' + id + '"] select[data-field="fieldType"] option:selected ').val();
	if(value == 'OEM') {
		$(target + ' tr[data-id="' + id + '"] input[data-field="fieldValue"]').prop({disabled:true});
	} else {
		$(target + ' tr[data-id="' + id + '"] input[data-field="fieldValue"]').prop({disabled:false});
	}
}
function updateFields(id,type) {
	// Read Currently stored
	var fieldName = customFields.data[id].fieldName;
	var prettyName = customFields.data[id].prettyName;
	var fieldType = customFields.data[id].fieldType;
	var fieldValue = customFields.data[id].fieldValue;
	var enabled = customFields.data[id].enabled;
	if(type == 'save') {
		// Update from fields
		var fieldName = $(target + ' tr[data-id="' + id + '"] input[data-field="fieldName"]').val();
		var prettyName = $(target + ' tr[data-id="' + id + '"] input[data-field="prettyName"]').val();
		var fieldType = $(target + ' tr[data-id="' + id + '"] select[data-field="fieldType"] option:selected').val();
		var fieldValue = $(target + ' tr[data-id="' + id + '"] input[data-field="fieldValue"]').val();
		var enabled = $(target + ' tr[data-id="' + id + '"] input[data-field="enabled"]').is(':checked');	
	}
	if(type == 'cancel') {
		// Update from fields
		$(target + ' tr[data-id="' + id + '"] input[data-field="fieldName"]').val(fieldName);
		$(target + ' tr[data-id="' + id + '"] input[data-field="prettyName"]').val(prettyName);
		$(target + ' tr[data-id="' + id + '"] select[data-field="fieldType"]').val(fieldType);
		$(target + ' tr[data-id="' + id + '"] input[data-field="fieldValue"]').val(fieldValue);
		$(target + ' tr[data-id="' + id + '"] input[data-field="enabled"]').prop('checked', enabled);	
	}
	// Update stored values
	var nData = {}
	nData.enabled = enabled;
	nData.fieldName = replaceSpecialChar(fieldName);
	nData.prettyName = prettyName;
	nData.fieldType = fieldType;
	nData.fieldValue = fieldValue;
	customFields.data[id] = nData;
	$(target + ' tr[data-id="' + id + '"] .field[data-field="fieldName"]').html(fieldName);
	$(target + ' tr[data-id="' + id + '"] .field[data-field="prettyName"]').html(prettyName);
	$(target + ' tr[data-id="' + id + '"] .field[data-field="fieldType"]').html(fieldType);
	$(target + ' tr[data-id="' + id + '"] .field[data-field="fieldValue"]').html(fieldValue);
};
function toggleRow(row) {
	$(target + ' tr[data-id="' + row + '"]').toggleClass('success');
	$(target + ' tr[data-id="' + row + '"] td button[data-edit]').toggle();
	$(target + ' tr[data-id="' + row + '"] td button[data-save]').toggle();
	$(target + ' tr[data-id="' + row + '"] td button[data-cancel]').toggle();
	$(target + ' tr[data-id="' + row + '"] td').children('input:not([type="checkbox"])').toggle();
	$(target + ' tr[data-id="' + row + '"] td').children('select').toggle();
	$(target + ' tr[data-id="' + row + '"] td').children('span.field').toggle();
}
function changeMode(row,element,type) {
	switch(type) {
		case 'edit' : // 
			checkForDisabled(row);
			toggleRow(row);
			$(target + ' tr[data-id="' + row + '"] td input[data-field="enabled"]').prop({disabled:false});
			break;
		case 'save' :
			updateFields(row,type);
			toggleRow(row);
			$(target + ' tr[data-id="' + row + '"] td input[data-field="enabled"]').prop({disabled:true});
			break;
		case 'cancel' :
			updateFields(row,type);
			toggleRow(row);
			$(target + ' tr[data-id="' + row + '"] td input[data-field="enabled"]').prop({disabled:true});
		default :
			break;
	}
}
function initializeButtons() {
	$(target + ' select[data-field="fieldType"]').on('change', function(e) {
		e.preventDefault();
		var id = $(this).parent().parent().data('id');
		checkForDisabled(id);	
	});
	$(target + ' input[data-field="fieldName"]').on('focusout', function(e) {
		var value = $(this).val();
		value = replaceSpecialChar(value);
		$(this).val(value);
	})
	$('button[data-edit]').on('click', function(e) {
		e.preventDefault();
		var row = $(this).data('edit');
		customFields.mode['row' + row] = 'edit';
		changeMode(row,$(this),'edit');
	})
	$('button[data-cancel]').on('click', function(e) {
		e.preventDefault();
		var row = $(this).data('cancel');
		customFields.mode['row' + row] = 'cancel';
		changeMode(row,$(this),'cancel');
	})
	$('button[data-save]').on('click', function(e) {
		e.preventDefault();
		var row = $(this).data('save');
		customFields.mode['row' + row] = 'save';
		changeMode(row,$(this),'save');
	})
}
function initializeToolTips() {
	$('button[data-cancel]').tooltip({
		placement: 'top',
		title: 'Cancel',
		delay: {show: 800, hide: 0}
	});
	$('button[data-edit]').tooltip({
		placement: 'top',
		title: 'Edit',
		delay: {show: 800, hide: 0}
	});
	$('button[data-save]').tooltip({
		placement: 'top',
		title: 'Save',
		delay: {show: 800, hide: 0}
	});
}
$( document ).ready(function() {
	buildTable(target);
	initializeToolTips();
});