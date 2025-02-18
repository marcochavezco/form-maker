'use client';

import { LetterTextIcon } from 'lucide-react';
import { ElementsType } from '../FormElements';

const type: ElementsType = 'TextField';

export const TextFieldFormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes: {
      label: 'Text Field',
      helperText: 'Helper text',
      required: false,
      placeholder: 'Value here...',
    },
  }),

  designerBtnElement: {
    icon: LetterTextIcon,
    label: 'Text Field',
  },

  designerComponent: () => <div>Designer component</div>,
  formComponent: () => <div>Form component</div>,
  propertiesComponent: () => <div>Properties component</div>,
};
