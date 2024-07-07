import {runTemplateCS1708i} from '@services/templates/runTemplateCS1708i';

const KVM_TYPE_TEMPLATES_MAP = [{type: 'CS1708i', func: runTemplateCS1708i}];

export const getTemplateByType = (type: string) => {
  if (!type || type.length === 0) {
    throw new Error('Name not found');
  }

  const template = KVM_TYPE_TEMPLATES_MAP.find((template) => template.type === type);

  if (!template) {
    throw new Error(`Template "${type}" not found`);
  }

  return template.func;
};
