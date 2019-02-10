from django.db import models

class MovieModel(models.Model):
    """Defining the movie table structure
    """

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=16000)
    author = models.CharField(max_length=255)
    modified = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)


