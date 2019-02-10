from rest_framework import serializers
from .models import MovieModel


class MovieSerializer(serializers.ModelSerializer):
    """Class helps to convert 
        django obj into json obj.
    """

    class Meta:
        model = MovieModel
        fields = (
            'id',
            'name',
            'description',
            'author',
            'modified',
            'created'
        )

