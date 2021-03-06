/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { FirebaseDataConverter } from '../../shared/converters/firebase-data-converter';
import { StringMap } from '../models/string-map.model';
import { Form } from '../models/form/form.model';
import { Map, List } from 'immutable';
import { Option } from '../../shared/models/form/option.model';
import { Field, FieldType } from '../models/form/field.model';
import {
  MultipleChoice,
  Cardinality,
} from '../models/form/multiple-choice.model';

class MockFirebaseData {
  static observation001 = {
    created: {
      clientTimestamp: undefined,
      serverTimestamp: undefined,
      user: {
        displayName: 'Creator',
        email: 'creator@test.com',
        id: 'creator001',
      },
    },
    lastModified: {
      clientTimestamp: undefined,
      serverTimestamp: undefined,
      user: {
        displayName: 'Modifier',
        email: 'modifier@test.com',
        id: 'modifier001',
      },
    },
    featureId: 'feature001',
    formId: 'form001',
    responses: {
      element001: 'text response',
      element002: ['option001', 'option002'],
    },
  };
}

class MockModel {
  static element001: Field = new Field(
    'element001',
    FieldType.TEXT,
    StringMap({ en: 'Text Field' }),
    /*required=*/ true,
    0
  );

  static element002: Field = new Field(
    'element002',
    FieldType.MULTIPLE_CHOICE,
    StringMap({ en: 'Multiple Select' }),
    /*required=*/ true,
    0,
    new MultipleChoice(
      Cardinality.SELECT_MULTIPLE,
      List([
        new Option(
          'option001',
          'code001',
          StringMap({ en: 'option 1' }),
          /* index= */
          0
        ),
        new Option(
          'option002',
          'code002',
          StringMap({ en: 'option 2' }),
          /* index= */
          0
        ),
      ])
    )
  );

  static form001: Form = new Form(
    'form001',
    Map({
      element001: MockModel.element001,
      element002: MockModel.element002,
    })
  );
}

describe('FirebaseDataConverter', () => {
  it('Observation converts back and forth without loosing data.', () => {
    expect(
      FirebaseDataConverter.observationToJS(
        FirebaseDataConverter.toObservation(
          MockModel.form001,
          'observation001',
          MockFirebaseData.observation001
        )
      )
    ).toEqual(MockFirebaseData.observation001);
  });
});
