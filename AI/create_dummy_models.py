import os
os.environ['KERAS_BACKEND'] = 'torch'
import keras
from keras import layers, models

def create_dummy_model(path, input_shape, num_classes, model_type='cnn'):
    print(f"Creating dummy model for {path}...")
    if model_type == 'cnn':
        model = models.Sequential([
            layers.Input(shape=input_shape),
            layers.Conv2D(32, (3, 3), activation='relu'),
            layers.Flatten(),
            layers.Dense(num_classes, activation='softmax' if num_classes > 1 else 'sigmoid')
        ])
    else: # MLP
        model = models.Sequential([
            layers.Input(shape=input_shape),
            layers.Dense(32, activation='relu'),
            layers.Dense(num_classes, activation='softmax' if num_classes > 1 else 'sigmoid')
        ])
    
    model.compile(optimizer='adam', loss='categorical_crossentropy' if num_classes > 1 else 'binary_crossentropy', metrics=['accuracy'])
    model.save(path)
    print(f"Model saved to {path}")

if __name__ == "__main__":
    models_to_create = [
        ('brain_tumor_model.h5', (150, 150, 3), 4, 'cnn'),
        ('lung_cancer_model.h5', (224, 224, 3), 3, 'cnn'),
        ('skin_disease_model.h5', (224, 224, 3), 5, 'cnn'),
        ('chest_tuberculosis_model.h5', (150, 150, 3), 2, 'cnn'),
        ('Reports/Blood_Reports/HeartDiseaseModel.h5', (13,), 1, 'mlp')
    ]

    for path, input_shape, num_classes, model_type in models_to_create:
        # Check if the directory exists
        dirname = os.path.dirname(path)
        if dirname and not os.path.exists(dirname):
            os.makedirs(dirname)
        
        # DELETE the file if it exists to avoid any Git LFS weirdness
        if os.path.exists(path):
            os.remove(path)
            
        create_dummy_model(path, input_shape, num_classes, model_type)
