# from rake_nltk import Rake
# from pyvi import ViPosTagger,ViTokenizer

# def ext_vi_kws(text):
#     with open('./static/vietnamese-stopwords.txt',encoding='utf-8') as file:
#         stopwords = file.read().splitlines()
        
#     # loại bỏ stopwords ra khỏi text trước khi xử lý
#     rake = Rake(stopwords=stopwords, include_repeated_phrases=False)
#     rake.extract_keywords_from_text(text)
#     phr_no_stopwords = rake.get_ranked_phrases()
#     kws = set()
#     kw_tags = ['N','Ny','Np','M'] # N: danh từ, Ny: danh từ viết tắt, Np: tên riêng, M: số
#     for phr in phr_no_stopwords:
#         if len(phr.split()) > 4:
#             tks = ViTokenizer.tokenize(text[text.lower().index(phr):text.lower().index(phr)+len(phr)]) # Chuyển câu thành các token từ
#             pos_tags = ViPosTagger.postagging(tks) # gán từ loại cho các token
#             # pos_tags[0]: danh sách từ, pos_tags[1]: danh sách pos tags
#             for i in range(len(pos_tags[0])): 
#                 if pos_tags[1][i] in kw_tags:
#                     kws.add(' '.join([w for w in pos_tags[0][i].split('_')]))
#         else:
#             pos_tag = ViPosTagger.postagging(phr)
#             if pos_tag[1][0] in kw_tags:
#                 kws.add(phr)
#     print(kws)
#     return kws

# print(list(ext_vi_kws('Về quy luật hình thành Đảng cộng sản Việt Nam, Hồ Chí Minh viết: chủ nghĩa Mác-Lênin kết hợp với phong trào công nhân và phong trào yêu nước đã dẫn tới việc thành lập Đảng cộng sản Đông Dương vào đầu năm 1930. Hãy phân tích sự sáng tạo của Người trong luận điểm trên.')))
from langdetect import detect

print(detect('*&@'))