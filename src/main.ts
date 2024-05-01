import dayjs from 'dayjs';
import 'dayjs/locale/ja';

dayjs.locale('ja');

export const getTime = () => {
  return dayjs().format('YYYY年M月D日 (ddd) HH:mm');
};

const cc = DataStudioApp.createCommunityConnector();

export const getAuthType = () => {
  const AuthTypes = cc.AuthType;
  return cc.newAuthTypeResponse().setAuthType(AuthTypes.NONE).build();
};

export const getConfig = () => {
  const config = cc.getConfig();
  return config.build();
};

export const getFields = () => {
  const cc = DataStudioApp.createCommunityConnector();
  const fields = cc.getFields();
  const types = cc.FieldType;

  fields.newDimension().setId('id').setName('ID').setType(types.NUMBER);

  fields
    .newDimension()
    .setId('projectId')
    .setName('プロジェクト ID')
    .setType(types.NUMBER);

  return fields;
};

export const getSchema = () => {
  const fields = getFields().build();
  return { schema: fields };
};

export const getData = (
  request: GoogleAppsScript.Data_Studio.Request<void>,
) => {
  const requestedFieldIds = request.fields.map(
    (field: { name: string }) => field.name || '',
  );
  const requestedFields = getFields().forIds(requestedFieldIds);

  const response = [
    { id: 1, projectId: '01' },
    { id: 2, projectId: '02' },
  ];
  const rows = responseToRows(requestedFields, response);

  return {
    schema: requestedFields.build(),
    rows: rows,
  };
};

const responseToRows = (
  requestedFields: GoogleAppsScript.Data_Studio.Fields,
  response: Array<{ id: Number; projectId: string }>,
) => {
  return response.map((data: { id: Number; projectId: string }) => {
    const row: Array<string | Number> = [];
    requestedFields.asArray().forEach(function (field) {
      switch (field.getId()) {
        case 'id':
          return row.push(data.id);
        case 'projectId':
          return row.push(data.projectId);
        default:
          return row.push('');
      }
    });
    return { values: row };
  });
};
