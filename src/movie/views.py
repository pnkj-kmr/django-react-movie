from rest_framework import viewsets, status  # , generics
from rest_framework.response import Response
from rest_framework.decorators import list_route
from django.db.models import Q
from .models import MovieModel
from .serializers import MovieSerializer
import traceback
from .omdbapi import OMDbAPI


class MovieView(viewsets.ReadOnlyModelViewSet):
    """Class view helps
        handle all operations of api request.
    """

    queryset = MovieModel.objects.all().order_by('-modified')
    serializer_class = MovieSerializer

    def list(self, request):
        try:            
            queries = self.get_queryset()
            serializer = MovieSerializer(queries, many=True)
            # print(">>> data", serializer.data)
            data = serializer.data
            for obj in data:
                obj['creationdate'] = obj['created'][:10] + " " + obj['created'][11:19]
            # print(">>> data", data)
            ret = {"data": data}
            return Response(ret, status=status.HTTP_200_OK)
        except:
            traceback.print_exc()
        return Response({"data": []}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request):
        try:
            # print("create >>>>> ", request)
            ret = {"data": []}
            return Response(ret, status=status.HTTP_200_OK)
        except:
            traceback.print_exc()
        return Response(ret, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def retrieve(self, request, pk=None):
        try:
            # print("retrieve >>>>> ", request, pk)
            queries = MovieModel.objects.filter(pk=pk)
            serializer = MovieSerializer(queries, many=True)
            # print(">>> data", serializer.data)
            # ret = {"data": serializer.data}
            data = serializer.data
            for obj in data:
                obj['creationdate'] = obj['created'][:10] + " " + obj['created'][11:19]
            ret = {"data": data}
            return Response(ret, status=status.HTTP_200_OK)
        except:
            traceback.print_exc()
        return Response(ret, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, pk=None):
        try:
            # print("update >>>>> ", request, pk)
            ret = {"data": []}
            return Response(ret, status=status.HTTP_200_OK)
        except:
            traceback.print_exc()
        return Response(ret, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def partial_update(self, request, pk=None):
        try:
            # print("partial_update >>>>> ", request, pk)
            ret = {"data": []}
            return Response(ret, status=status.HTTP_200_OK)
        except:
            traceback.print_exc()
        return Response(ret, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, pk=None):
        pass

    @list_route(url_path="search")
    def get_result(self, request, *args, **kwargs):
        try:
            # print("search >> ", request.GET)
            searched_val = str(request.GET.get('searchValue', ''))
            search_sub = Q(name__icontains=searched_val) | \
                        Q(description__icontains=searched_val) | \
                        Q(author__icontains=searched_val) 
            
            queries = MovieModel.objects.filter(search_sub)
            serializer = MovieSerializer(queries, many=True)
            # print(">>> data", serializer.data)
            # ret = {"data": serializer.data}
            data = serializer.data
            for obj in data:
                obj['creationdate'] = obj['created'][:10] + " " + obj['created'][11:19]

            # Database is not having the entry then
            if not data:
                omdb = OMDbAPI()
                values = searched_val.split("|")
                objs = []
                if not isinstance(values, list):
                    values = [values]
                for value in values:
                    temp = {}
                    if value.find(";") != -1:
                        for value_ in value.split(";"):
                            if value_.find("=") != -1:
                                key = value_[:value.index("=")]
                                val = value_.replace(key + "=", "")
                                temp.update({key.strip(): val.strip()})
                            else:
                                result_ = omdb.get_request(value_)
                                if result_:
                                    objs += omdb.form_response(result_)
                                continue
                        value = temp
                    else:
                        if value.find("=") != -1:
                            key = value[:value.index("=")]
                            val = value.replace(key + "=", "")
                            value = {key.strip(): val.strip()}
                    result_ = omdb.get_request(value)
                    if result_:
                        objs += omdb.form_response(result_)
                data = objs
            print(">>> data", data)

            ret = {"data": data}
            return Response(ret, status=status.HTTP_200_OK)
        except:
            traceback.print_exc()
        return Response({"data": []}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @list_route(url_path="submit")
    def submit_data(self, request, *args, **kwargs):
        try:
            # print("SAVE >> ", request.GET)
            data = request.GET 
            data_id = data.get('id')
            data_dict = {
                "name": data.get("name"),
                "description": data.get("descr"),
                "author": data.get("author"),
            }
            # print("SAVE >> ", data_dict)  
            if data_id in (0, None, '0', 'None', 'null', 'undefined'):
                ret = self.insert_data(data_dict)
            else:
                ret = self.update_data(data_dict, pk=data_id)
            
            ret = {"data": ret}
            return Response(ret, status=status.HTTP_200_OK)
        except:
            traceback.print_exc()
        return Response({"data": []}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def insert_data(self, obj):
        """Function helps to save the data into database
        """
        orm = MovieModel(**obj)
        orm.save()
        if orm.id:
            return True
        return False
    
    def update_data(self, obj, pk):
        """Function helps to update the data into database
        """
        pk = int(pk)
        orm = MovieModel.objects.filter(pk=pk).update(**obj)
        if orm == 1:
            return True
        return False



