# import os
# import torch
# import torch.nn as nn
# import clip
# import cv2
# import numpy as np
# from PIL import Image
# import torchvision.transforms as transforms
# from timm.models.vision_transformer import vit_base_patch16_224
# from aws import upload_missing_img
# import asyncio
# from datetime import datetime

# # OpenCV 오류 문구 무시
# os.environ['OPENCV_LOG_LEVEL'] = 'SILENT'

# # GPU 설정
# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# class TransformerClassifier(nn.Module):
#     def __init__(self, attr_num, attr_words, dim=768, pretrain_path=None, vit_pretrain_path=None):
#         super().__init__()
#         self.attr_num = attr_num
#         self.word_embed = nn.Linear(512, dim)
#         self.visual_embed = nn.Linear(512, dim)
#         self.vit = vit_base_patch16_224(pretrained=False)
#         if vit_pretrain_path:
#             self.vit = self.load_vit_weights(self.vit, vit_pretrain_path)
#         self.blocks = self.vit.blocks
#         self.norm = self.vit.norm
#         self.weight_layer = nn.ModuleList([nn.Linear(dim, 1) for _ in range(self.attr_num)])
#         self.bn = nn.BatchNorm1d(self.attr_num)
#         self.text = clip.tokenize(attr_words).to(device)

#         if pretrain_path:
#             self.load_transformer_classifier_weights(pretrain_path)
#             print(f"Loaded pre-trained weights from {pretrain_path}")

#     def forward(self, video_tensor, ViT_model):
#         video_tensor = video_tensor.to(device)
#         ViT_features = ViT_model.encode_image(video_tensor).float().to(device)
#         ViT_image_features = self.visual_embed(ViT_features).to(device)

#         text_features = ViT_model.encode_text(self.text).float().to(device)
#         textual_features = self.word_embed(text_features).to(device)
#         textual_features = textual_features.unsqueeze(0).expand(ViT_image_features.size(0), -1, -1).to(device)

#         x = torch.cat([textual_features, ViT_image_features.unsqueeze(1)], dim=1).to(device)

#         for blk in self.blocks:
#             x = blk(x).to(device)
#         x = self.norm(x).to(device)
#         logits = torch.cat([self.weight_layer[i](x[:, i, :]) for i in range(self.attr_num)], dim=1).to(device)
        
#         logits = self.bn(logits).to(device)
#         return logits

#     def load_vit_weights(self, model, pretrain_path):
#         checkpoint = torch.load(pretrain_path, map_location=device)
#         model.load_state_dict(checkpoint, strict=False)
#         print(f"Loaded model weights from {pretrain_path}")
#         return model

#     def load_transformer_classifier_weights(self, pretrain_path):
#         checkpoint = torch.load(pretrain_path, map_location=device)
#         state_dict = checkpoint['model_state_dict']
#         model_dict = self.state_dict()
#         pretrained_dict = {k: v for k, v in state_dict.items() if k in model_dict and v.size() == model_dict[k].size()}
#         model_dict.update(pretrained_dict)
#         self.load_state_dict(model_dict)

# def load_yolo_model(weights_path="./yolo/yolov3.weights", config_path="./yolo/yolov3.cfg", names_path="./yolo/coco.names"):
#     net = cv2.dnn.readNet(weights_path, config_path)
#     if device.type == "cuda":
#         net.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)
#         net.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA)
#     else:
#         net.setPreferableBackend(cv2.dnn.DNN_BACKEND_DEFAULT)
#         net.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)
#     with open(names_path, "r") as f:
#         classes = [line.strip() for line in f.readlines()]
#     layer_names = net.getLayerNames()
#     output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]
#     return net, output_layers, classes

# def detect_people(frame, net, output_layers, classes):
#     height, width, channels = frame.shape
#     blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
#     net.setInput(blob)
#     outs = net.forward(output_layers)
#     class_ids, confidences, boxes = [], [], []

#     for out in outs:
#         for detection in out:
#             scores = detection[5:]
#             class_id = np.argmax(scores)
#             confidence = scores[class_id]
#             if confidence > 0.5 and classes[class_id] == 'person':
#                 center_x = int(detection[0] * width)
#                 center_y = int(detection[1] * height)
#                 w = int(detection[2] * width)
#                 h = int(detection[3] * height)
#                 x = int(center_x - w / 2)
#                 y = int(center_y - h / 2)
#                 boxes.append([x, y, w, h])
#                 confidences.append(float(confidence))
#                 class_ids.append(class_id)

#     indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.5)
#     people = [(frame[max(0, y):min(height, y+h), max(0, x):min(width, x+w)], (x, y, w, h)) for i, (x, y, w, h) in enumerate(boxes) if i in indexes]
#     return people

# async def run_model(user_conditions, video_paths, cctv_idxs, missing_id):
#     results = []
#     net, output_layers, classes = load_yolo_model()

#     preprocess = transforms.Compose([
#         transforms.Resize((224, 224)),
#         transforms.ToTensor(),
#         transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
#     ])

#     groups = {
#         'length_top': attr_words[0:1],
#         'length_bottom': attr_words[1:2],
#         'bags': attr_words[2:4],
#         'accessories': attr_words[4:8],
#         'bottom type': [attr_words[8]],
#         'pose': attr_words[9:15],
#         'motion': attr_words[15:20],
#         'top color': attr_words[20:29],
#         'bottom color': attr_words[29:39],
#         'age': attr_words[39:43]
#     }

#     output_dir = "output_images"
#     os.makedirs(output_dir, exist_ok=True)

#     model.eval()
#     image_idx = 1
#     for video_path, cctv_idx in zip(video_paths, cctv_idxs):
#         cap = cv2.VideoCapture(video_path)
#         while True:
#             ret, frame = cap.read()
#             if not ret:
#                 break

#             people = detect_people(frame, net, output_layers, classes)
#             for person_img, (x, y, w, h) in people:
#                 person_img_rgb = cv2.cvtColor(person_img, cv2.COLOR_BGR2RGB)
#                 person_img_resized = cv2.resize(person_img_rgb, (224, 224))
#                 video_tensor = preprocess(Image.fromarray(person_img_resized)).unsqueeze(0).to(device)

#                 with torch.no_grad():
#                     predictions = model(video_tensor, ViT_model)

#                 probabilities = torch.sigmoid(predictions).cpu().numpy()[0]

#                 conditions_met = True
#                 for group_name, group_attrs in groups.items():
#                     max_prob = 0
#                     max_attr = None
#                     for attr in group_attrs:
#                         prob = probabilities[attr_words.index(attr)]
#                         if prob > max_prob:
#                             max_prob = prob
#                             max_attr = attr

#                     if group_name == 'length_top':
#                         predicted_length_top = 'short top' if max_prob > 0.50 else 'long top'
#                         if 'length_top' in user_conditions and user_conditions['length_top'] != predicted_length_top:
#                             conditions_met = False

#                     elif group_name == 'length_bottom':
#                         predicted_length_bottom = 'short bottom' if max_prob > 0.50 else 'long bottom'
#                         if 'length_bottom' in user_conditions and user_conditions['length_bottom'] != predicted_length_bottom:
#                             conditions_met = False

#                     elif group_name in user_conditions and user_conditions[group_name] != max_attr:
#                         conditions_met = False

#                 if conditions_met:
#                     cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

#                     # 현재 시간 추가
#                     current_time = datetime.now().strftime("%Y%m%d%H%M%S")
#                     output_image_path = os.path.join(output_dir, f"{missing_id}_{current_time}_output_{image_idx}.jpg")
#                     cv2.imwrite(output_image_path, frame)
#                     image_idx += 1

#                     # AWS S3에 이미지 업로드 (비동기 함수로 호출)
#                     s3_url = await asyncio.to_thread(upload_missing_img, output_image_path)
#                     if s3_url is None:
#                         print("Image uploaded: False")
#                     else:
#                         print(f"Image uploaded: True, URL: {s3_url}")

#                     # 결과 저장을 위해 필요한 데이터를 저장
#                     results.append((missing_id, cctv_idx, s3_url))
#                     print("True")
#                 else:
#                     print("False")

#         cap.release()

#     return {"status": "success", "message": "Images saved successfully.", "results": results}

# # 모델과 텍스트 정의를 글로벌하게 설정
# attr_words = [
#     'top short', 'bottom short', 'shoulder bag', 'backpack', 'hat', 'hand bag', 'long hair', 'female',
#     'bottom skirt', 'frontal', 'lateral-frontal', 'lateral', 'lateral-back', 'back', 'pose varies',
#     'walking', 'running', 'riding', 'staying', 'motion varies', 'top black', 'top purple', 'top green',
#     'top blue', 'top gray', 'top white', 'top yellow', 'top red', 'top complex', 'bottom white', 'bottom purple',
#     'bottom black', 'bottom green', 'bottom gray', 'bottom pink', 'bottom yellow', 'bottom blue', 'bottom brown',
#     'bottom complex', 'young', 'teenager', 'adult', 'old'
# ]
# attr_num = len(attr_words)
# pretrain_path = './VTF-Pretrain.pth'
# vit_pretrain_path = './jx_vit_base_p16_224-80ecf9dd.pth'
# model = TransformerClassifier(attr_num, attr_words, pretrain_path=pretrain_path, vit_pretrain_path=vit_pretrain_path).to(device)
# ViT_model, _ = clip.load('ViT-B/16', device=device)
