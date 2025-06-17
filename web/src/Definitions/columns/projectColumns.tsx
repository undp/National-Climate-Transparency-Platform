import { useTranslation } from 'react-i18next';

export const getProjectTableColumns = () => {
  const { t } = useTranslation(['formTable']);

  const projTableColumns = [
    {
      title: t('projectId'),
      dataIndex: 'projectId',
      key: 'projectId',
      render: (_: any, record: any) => {
        return <a href={`/projects/view/${record.projectId}`}>{record.projectId}</a>;
      },
    },
    { title: t('projectName'), dataIndex: 'projectName', key: 'projectName' },
  ];

  return projTableColumns;
};
